import {
  checkSettings,
  contributeWord,
  wordFromID,
  startNewRound,
  localAxios,
} from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { log } from "../logger";

async function handleStartGame(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any,
  hostChoice: any
) {
  const defaultError = "there was an error with starting your game";
  let r = checkSettings(settings);
  if (!r.ok) {
    handleErrorMessage(io, socket, 2006, defaultError);
    return;
  }
  let { word, source } = r.settings;
  if (word.id === 0) {
    try {
      word = await contributeWord(word.word, word.definition, source);
    } catch (err) {
      log(
        `[!ERROR] handleStartGame -> contributeWord(${word.word}, ${word.definition}, ${source})`
      );
      handleErrorMessage(io, socket, 2006, defaultError);
      return;
    }
  } else {
    let r = await wordFromID(word.id);
    if (r.ok) {
      word = r.word;
    }
  }
  let newRound: any;
  try {
    newRound = await startNewRound(
      socket.id,
      word,
      lobbies,
      lobbyCode,
      r.settings
    );
  } catch (err) {
    log(
      `[!ERROR] handleStartGame -> startNewRound by ${socket.id} with "${word.word}" from ${source}`
    );
    handleErrorMessage(io, socket, 2006, defaultError);
    return;
  }
  if (newRound.ok && newRound.result?.status === 201) {
    lobbies = newRound.lobbies;
    // update the host token
    if (hostChoice.word_id_one > 0 && hostChoice.word_id_two > 0) {
      try {
        await localAxios.post("/api/choice", {
          ...hostChoice,
          round_id: newRound.roundId,
        });
      } catch (err) {
        log("error recording the host's choices");
        log(err.message);
        handleErrorMessage(io, socket, 2006, defaultError);
        return;
      }
    }
    // pub-sub update
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    log("there was a server error while starting the game");
    handleErrorMessage(io, socket, 2006, defaultError);
  }
}

export default handleStartGame;
