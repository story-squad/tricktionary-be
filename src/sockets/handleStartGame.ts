import { localAxios } from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { GameSettings } from "../GameSettings";
async function handleStartGame(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any
) {
  let lobbySettings;

  try {
    lobbySettings = GameSettings(settings);
  } catch (err) {
    console.log("settings error");
    handleErrorMessage(io, socket, err);
    return;
  }
  if (!lobbySettings.ok) {
    handleErrorMessage(io, socket, lobbySettings.message);
    return;
  }
  // lobbySettings are now verified.
  console.log(`timer set to ${lobbySettings.value.seconds}`);
  let { word } = lobbySettings.value;
  const { source } = lobbySettings.value;
  if (word.id === 0) {
    console.log("new word!");

    // write word to user-word db table.
    try {
      const {data} = await localAxios.post("/api/words/contribute", {
        word: word.word,
        definition: word.definition,
        source
      });
      console.log(data)
      if (data?.id > 0) {
        word.id = data.id;
      }
    } catch (err) {
      console.log("error contributing.")
      console.log(err);
    }
  } else {
    console.log(`word from ${lobbySettings.value.source}`);
    // begin get word from source
    let output: any;
    // let word:string;
    try {
      // get word by id
      output = await localAxios.get(`/api/words/id/${word.id}`);
      word = output?.data?.word;
      if (!word.word) {
        handleErrorMessage(
          io,
          socket,
          `error requesting word with id ${word.id} from ${lobbySettings.value.source}`
        );
        return;
      }
    } catch (err) {
      console.log(err);
      handleErrorMessage(io, socket, err);
      return;
    }
    // end get word from source
  }

  const phase: string = "WRITING";
  // start a new round
  let newRound: any;
  let roundId: any;
  try {
    console.log("starting a new round...");
    newRound = await localAxios.post("/api/round/start", {
      lobby: lobbies[lobbyCode],
      wordId: word.id
    });
    roundId = newRound.data?.roundId;
  } catch (err) {
    console.log("error trying to start new round!");
    handleErrorMessage(io, socket, err);
  }
  console.log("ROUND ID:", roundId);
  const roundSettings: any = {
    seconds: lobbySettings.value.seconds,
    source: lobbySettings.value.source,
    filter: lobbySettings.value.filter
  };
  // set phasers to "WRITING" and update the game state
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    phase,
    word: word.word,
    definition: word.definition,
    roundId,
    roundSettings,
    host: socket.id
  };
  // REST-ful update
  let result: any;
  try {
    result = await localAxios.post("/api/user-rounds/add-players", {
      players: lobbies[lobbyCode].players,
      roundId
    });
  } catch (err) {
    console.log("error: handleStartGame:55");
    handleErrorMessage(io, socket, err);
  }
  if (result?.status === 201) {
    // pub-sub update
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log("error updating game");
  }
}

export default handleStartGame;
