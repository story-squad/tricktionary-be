import {
  checkSettings,
  contributeWord,
  wordFromID,
  startNewRound,
  localAxios,
} from "./common";
import handleErrorMessage from "./handleErrorMessage";
async function handleStartGame(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any,
  hostChoice: any
) {
  let r = checkSettings(settings);
  if (!r.ok) {
    handleErrorMessage(io, socket, 2006,'there was an error with starting your game');
    return;
  }
  console.log(r.settings);
  let { word, source } = r.settings;
  if (word.id === 0) {
    word = await contributeWord(word.word, word.definition, source);
  } else {
    let r = await wordFromID(word.id);
    if (r.ok) {
      word = r.word;
    }
  }
  let newRound = await startNewRound(
    socket.id,
    word,
    lobbies,
    lobbyCode,
    r.settings
  );
  if (newRound.ok && newRound.result?.status === 201) {
    lobbies = newRound.lobbies;
    // update the host token
    try {
      await localAxios.post("/api/choice", {
        ...hostChoice,
        round_id: newRound.roundId,
      });
    } catch (err) {
      console.log("error recording the host's choices");
      console.log(err.message);
    }

    // pub-sub update
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log("there was a server error while starting the game");
  }
}

export default handleStartGame;
