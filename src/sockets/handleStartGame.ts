import {
  checkSettings,
  contributeWord,
  wordFromID,
  startNewRound
} from "./common";
import handleErrorMessage from "./handleErrorMessage";
async function handleStartGame(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any
) {
  let r = checkSettings(settings);
  if (!r.ok) {
    handleErrorMessage(io, socket, r?.message);
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
    
    // pub-sub update
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log("error updating game");
  }
}

export default handleStartGame;
