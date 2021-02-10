import { GameSettings } from "../GameSettings";

// import * as dotenv from "dotenv";
// import util from "util";
// import { exec as cmd } from "child_process";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${
    process.env.PORT || 5000
  }`
});
localAxios.defaults.timeout = 10000;
const LC_LENGTH: number = 4; // number of characters in lobbyCode
export {
  LC_LENGTH,
  localAxios,
  fortune,
  privateMessage,
  playerIsHost,
  checkSettings,
  contributeWord,
  wordFromID,
  startNewRound,
  b64,
  whereAmI
};

// const exec = util.promisify(cmd);

async function fortune() {
  // returns a promise
  // const { stdout, stderr } = await exec("fortune");
  // return { fortune: stdout, error: stderr };
  return { fortune: "coming soon?" };
}

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
    console.log(`${listener} message -> ${socket.id}`);
  } catch (err) {
    console.log({ [listener]: message });
  }
}

function playerIsHost(socket: any, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === socket.id;
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
    console.log("settings error");
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
  console.log("new word!");
  let newWord = { word, definition, source, id: 0 };
  // write word to user-word db table.
  try {
    const { data } = await localAxios.post("/api/words/contribute", {
      word,
      definition,
      source
    });
    // console.log(data)
    if (data?.id > 0) {
      newWord.id = data.id;
    }
  } catch (err) {
    console.log("error contributing.");
    console.log(err);
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
    console.log("starting a new round...");
    newRound = await localAxios.post("/api/round/start", {
      lobby: lobbies[lobbyCode],
      wordId: word.id,
      lobbyCode
    });
    roundId = newRound.data.roundId;
  } catch (err) {
    console.log("error trying to start new round!");
    return { ok: false, message: err.message };
  }
  console.log("ROUND ID:", roundId);
  const roundSettings: any = {
    seconds: lobbySettings.seconds,
    source: lobbySettings.source,
    filter: lobbySettings.filter
  };
  // set phasers to "WRITING" and update the game state
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    phase,
    word: word.word,
    definition: word.definition,
    roundId,
    roundSettings,
    host
  };
  // REST-ful update
  let result: any;
  try {
    result = await localAxios.post("/api/user-rounds/add-players", {
      players: lobbies[lobbyCode].players,
      roundId,
      game_id: lobbies[lobbyCode].game_id
    });
  } catch (err) {
    return { ok: false, result, lobbies };
  }
  return { ok: true, result, lobbies };
}

type lobbyCode = string | null;
/**
 * @param socket (socket io)
 * @returns the lobby code attached to this socket (string).
 */
function whereAmI(socket: any):lobbyCode {
  return Array.from(socket.rooms).length > 1
    ? String(Array.from(socket.rooms)[1])
    : null;
}

// encode a string in Base64
const encode64 = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

// decode a string from Base64
const decode64 = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

const b64 = { encode: encode64, decode: decode64 };

export function gameExists(lobbyCode: string, lobbies: any) {
  return Object.keys(lobbies).filter((l) => l === lobbyCode).length > 0;
}

export async function newPlayerRecord(socket: any) {
  let last_user_id = socket.id;
  let token;
  let player;
  try {
    const login = await localAxios.post("/api/auth/new-player", {
      last_user_id
    });
    console.log(login.data);
    token = login.data.token;
    player = login.data.player;
  } catch (err) {
    return { ok: false, message: err.message };
  }
  return { ok: true, player, token };
}
