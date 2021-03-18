import { GameSettings } from "../GameSettings";
import { log } from "../logger";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${
    process.env.PORT || 5000
  }`,
});
localAxios.defaults.timeout = 10000;

/**
 * maximum number of players per lobby
 */
const MAX_PLAYERS = process.env.MAX_PLAYERS || 30;

/**
 * Number of characters in lobbyCode
 */
const LC_LENGTH: number = process.env.LC_LENGTH
  ? Number(process.env.LC_LENGTH)
  : 4;

/**
 * POINTS AWARDED when you choose correctly
 */
const VALUE_OF_TRUTH: number = process.env.VALUE_OF_TRUTH
  ? Number(process.env.VALUE_OF_TRUTH)
  : 2;

/**
 * POINTS AWARDED when others choose your definition
 */
const VALUE_OF_BLUFF: number = process.env.VALUE_OF_BLUFF
  ? Number(process.env.VALUE_OF_BLUFF)
  : 1;

export {
  MAX_PLAYERS,
  VALUE_OF_BLUFF,
  VALUE_OF_TRUTH,
  LC_LENGTH,
  localAxios,
  privateMessage,
  playerIsHost,
  playerIdWasHost,
  sendToHost,
  checkSettings,
  contributeWord,
  wordFromID,
  startNewRound,
  b64,
  whereAmI,
  updatePlayerToken,
};

/**
 * send message to socket.id
 *
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param listener string
 * @param message string
 *
 * helper function; not directly exposed to the public.
 *
 * please handle all necessary authority role checks, prior to invocation.
 */
async function privateMessage(
  io: any,
  socket: any,
  listener: string,
  message: string
) {
  try {
    const pid = socket.id;
    io.to(pid).emit(listener, message); // private message player
    log(`${listener} message -> ${socket.id}`);
  } catch (err) {
    log(`${listener}: ${message}`);
  }
}

async function sendToHost(
  io: any,
  socket: any,
  lobbies: any,
  category: string,
  message: any
) {
  try {
    const lobbyCode = whereAmI(socket);
    if (lobbyCode) {
      io.to(lobbies[lobbyCode].host).emit(category, message);
    }
  } catch (err) {
    return false;
  }
  return true;
}

function playerIsHost(socket: any, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === socket.id;
    return { ok };
  } catch (err) {
    return { ok: false, message: err };
  }
}

function playerIdWasHost(playerId: string, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === playerId;
    return { ok };
  } catch (err) {
    return { ok: false, message: err };
  }
}

function checkSettings(settings: any) {
  let lobbySettings;
  try {
    lobbySettings = GameSettings(settings);
  } catch (err) {
    log("settings error");
    return { ok: false, message: err.message, settings };
  }
  if (!lobbySettings.ok) {
    return { ok: false, message: lobbySettings.message, settings };
  }
  return { ok: true, settings };
}

async function contributeWord(
  word: string,
  definition: string,
  source: string
) {
  log("new word!");
  let newWord = { word, definition, source, id: 0 };
  // write word to user-word db table.
  try {
    const { data } = await localAxios.post("/api/words/contribute", {
      word,
      definition,
      source,
    });
    // log(data)
    if (data?.id > 0) {
      newWord.id = data.id;
    }
  } catch (err) {
    log("error contributing.");
    log(err);
  }
  return newWord;
}

async function wordFromID(id: any) {
  let word;
  try {
    let output = await localAxios.get(`/api/words/id/${id}`);
    word = output?.data?.word;
    if (!word.word) {
      return { ok: false, message: "wordFromID: error" };
    }
  } catch (err) {
    return { ok: false, message: err.message };
  }
  return { ok: true, word };
}

async function startNewRound(
  host: string,
  word: any,
  lobbies: any,
  lobbyCode: string,
  lobbySettings: any
) {
  const phase: string = "WRITING";
  // start a new round
  let newRound: any;
  let roundId: any;
  try {
    log("starting a new round...");
    newRound = await localAxios.post("/api/round/start", {
      lobby: lobbies[lobbyCode],
      wordId: word.id,
      lobbyCode,
    });
    roundId = newRound.data.roundId;
    log("ROUND ID: " + roundId);
  } catch (err) {
    log("error trying to start new round!");
    return { ok: false, message: err.message };
  }
  const roundSettings: any = {
    seconds: lobbySettings.seconds,
    source: lobbySettings.source,
    filter: lobbySettings.filter,
  };
  // set phasers to "WRITING" and update the game state
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    phase,
    word: word.word,
    definition: word.definition,
    roundId,
    roundSettings,
    host,
  };
  // REST-ful update
  let result: any;
  try {
    result = await localAxios.post("/api/user-rounds/add-players", {
      players: lobbies[lobbyCode].players,
      roundId,
      game_id: lobbies[lobbyCode].game_id,
    });
  } catch (err) {
    return { ok: false, result, lobbies };
  }
  return { ok: true, result, lobbies, roundId };
}

type lobbyCode = string | null;
/**
 * @param socket (socket io)
 * @returns the lobby code attached to this socket (string).
 */
function whereAmI(socket: any): lobbyCode {
  return Array.from(socket.rooms).length > 1
    ? String(Array.from(socket.rooms)[1])
    : null;
}

/**
 * encode a string in Base64
 * @param str string
 */
const encode64 = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

/**
 * decode a string from Base64
 * @param str string
 */
const decode64 = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

/**
 * Base64 string operatoins
 */
const b64 = { encode: encode64, decode: decode64 };

/**
 * returns true if LobbyCode can be found in Lobbies
 *
 * @param lobbyCode LobbyCode of game
 * @param lobbies socket-handler games
 */
export function gameExists(lobbyCode: string, lobbies: any) {
  return Object.keys(lobbies).filter((l) => l === lobbyCode).length > 0;
}

/**
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param p_id Player UUID
 * @param name Player's username
 * @param definition Player's definition
 * @param points Player's points
 * @param lobbyCode Players current game code
 */
async function updatePlayerToken(
  io: any,
  socket: any,
  p_id: string,
  name: string,
  definition: string | undefined,
  points: number | undefined,
  lobbyCode: string,
  info?: string,
) {
  let token;
  try {
    // update the HOST's token with lobbyCode
    const payload = {
      s_id: socket.id,
      p_id,
      name,
      definition: definition || "",
      points: points || 0,
      lobbyCode,
    };
    const { data } = await localAxios.post("/api/auth/update-token", payload);
    if (data.ok) {
      // send token to player
      io.to(socket.id).emit('token update', data.token, info);
      // update the database
      token = data.token;
      await localAxios.put(`/api/player/id/${p_id}`, {
        token,
        last_played: lobbyCode,
      });
    } else {
      log(data.message);
      return data;
    }
  } catch (err) {
    log(err.message);
    return { ok: false, message: err.message };
  }
  return { ok: true, token };
}
