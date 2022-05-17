import { GameSettings } from "../GameSettings";
import { log } from "../logger";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || "http://localhost"}:${
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
  : 1;

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
  RoundScoreItem,
  RoundItem,
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
  getDef,
  doIt,
  tieBreakerMatch,
  getCurrentRoundIndex,
  getCurrentPlayerScoreIndex,
};

async function getDef(user_id: string, definitionId: number) {
  let r: any;
  let rWord: any;
  try {
    const mvd = await localAxios.get(`/api/definitions/id/${definitionId}`);
    const round_id = mvd.data.definition.round_id;
    const definition = mvd.data.definition.definition;
    r = await localAxios.get(`/api/round/id/${round_id}`);
    rWord = await localAxios.get(`/api/words/id/${r.data.round.word_id}`);
    const { word } = rWord.data.word;
    const result = { user_id, definition, word };
    return result;
  } catch (err:any) {
    if (err instanceof Error) log(err.message);
    return;
  }
}

/**
 * Get the index of the current round
 *
 * @param lobbies
 * @param lobbyCode
 *
 * Helper function to determine where in the rounds array is the current round
 */

// Setup the interfaces for round item
interface RoundItem {
  roundNum: string;
  scores: [];
}

function getCurrentRoundIndex(lobbies: any, lobbyCode: any) {
  // Get the current round
  const currentRound = lobbies[lobbyCode].rounds.length;

  // Get the index of the round
  const curRoundIndex = lobbies[lobbyCode].rounds.findIndex(
    (x: RoundItem) => x.roundNum === String(currentRound)
  );

  return curRoundIndex;
}

/**
 * Get the index of the current player for the score
 *
 * @param lobbies
 * @param lobbyCode
 *
 * Helper function to determine where in the scores array(from the rounds array) is the current player's score info
 */

// Setup the interfaces for score item
interface RoundScoreItem {
  playerId: string;
  score: string;
}

function getCurrentPlayerScoreIndex(
  lobbies: any,
  lobbyCode: any,
  playerId: string
) {
  // Get the index of the round
  const curRoundIndex = getCurrentRoundIndex(lobbies, lobbyCode);

  // Get the index of the round
  const curPlayerScoreIndex = lobbies[lobbyCode].rounds[
    curRoundIndex
  ].scores.findIndex((x: RoundScoreItem) => x.playerId === playerId);

  return curPlayerScoreIndex;
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
    log(`${listener} message -> ${socket.id}`);
  } catch (err:any) {
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
  } catch (err:any) {
    return false;
  }
  return true;
}

function playerIsHost(socket: any, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === socket.id;
    return { ok };
  } catch (err:any) {
    return { ok: false, message: err };
  }
}

function playerIdWasHost(playerId: string, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === playerId;
    return { ok };
  } catch (err:any) {
    return { ok: false, message: err };
  }
}

function checkSettings(settings: any) {
  let lobbySettings;
  try {
    lobbySettings = GameSettings(settings);
  } catch (err:any) {
    log("settings error");

    if (err instanceof Error)
      return { ok: false, message: err.message, settings };

    return { ok: false };
  }
  if (!lobbySettings.ok) {
    return { ok: false, message: lobbySettings.message, settings };
  }
  return { ok: true, settings };
}

async function contributeWord(
  word: string,
  definition: string,
  category: string,
  source: string
) {
  log("new word!");
  let newWord = { word, definition, category, source, id: 0 };
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
  } catch (err:any) {
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
  } catch (err:any) {
    return { ok: false, message: err.message };
  }
  return { ok: true, word };
}

async function checkScores(lobbyCode: string, lobbies: any) {
  const players = lobbies[lobbyCode]?.players;
  const game_id = lobbies[lobbyCode].game_id;
  if (!players) {
    log(`[!ERROR] no players in ${lobbyCode}`);
    return { ok: false, error: `invalid lobby @ ${lobbyCode}` };
  }
  // add host to list
  log(`updating score-cards for players in ${lobbyCode}`);
  return await [...players, {}].forEach(async (playerObj: any) => {
    const { username, pid } = playerObj;
    const pathname = `/api/score/player/${pid}/game/${game_id}`;
    let score = await localAxios.get(pathname);
    if (!score.data.id) {
      log(`creating score card for ${username}`);
      score = await localAxios.post("/api/score/new", {
        game_id,
        playerId: pid,
      });
      log(`created score card ${score.data?.id} for ${username}`);
    } else {
      log(`found score card ${score.data.id}, for ${username}`);
      // todo
    }
  });
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
  // make sure every player has a score-card for this game.
  await checkScores(lobbyCode, lobbies);

  try {
    log("starting a new round...");
    newRound = await localAxios.post("/api/round/start", {
      lobby: lobbies[lobbyCode],
      wordId: word.id,
      lobbyCode,
    });
    roundId = newRound.data.roundId;
    log("ROUND ID: " + roundId);
  } catch (err:any) {
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
    category: word.category !== undefined ? word.category : "thing",
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
  } catch (err:any) {
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
  info?: string
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
      io.to(socket.id).emit("token update", data.token, info);
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
  } catch (err:any) {
    log(err.message);
    return { ok: false, message: err.message };
  }
  return { ok: true, token };
}

async function doIt(
  game_id: string,
  firstPlace: any,
  secondPlace?: any,
  thirdPlace?: any
) {
  let r: any[] = [];
  // get most voted definition(s)
  try {
    const firstPlaceResult = await getDef(
      firstPlace.id, // socket.id
      firstPlace.definitionId
    );
    r = [{ ...firstPlaceResult }];
  } catch (err:any) {
    log("error getting 1st place");
    log(err.message);
  }
  if (secondPlace) {
    try {
      const secondPlaceResult = await getDef(
        secondPlace.id,
        secondPlace.definitionId
      );
      r = [...r, { ...secondPlaceResult }];
    } catch (err:any) {
      log("error getting second place");
      log(err.message);
    }
  }
  if (thirdPlace) {
    try {
      const thirdPlaceResult = await getDef(
        thirdPlace.id,
        thirdPlace.definitionId
      );
      r = [...r, { ...thirdPlaceResult }];
    } catch (err:any) {
      log("error getting third place");
      log(err.message);
    }
  }
  return r;
}

async function tieBreakerMatch(
  checkPoints: any[],
  game_id: string,
  lobbies: any[],
  lobbyCode: any
) {
  log("tie-breaker necessary");
  // create 3 placeholders
  let firstPlace;
  let thirdPlace;
  let tiebreaker;

  if (checkPoints[0].points !== checkPoints[1].points) {
    // A. is firstplace unique?
    firstPlace = lobbies[lobbyCode].players
      .filter((p: any) => p.pid === checkPoints[0].playerId)
      .pop();
    log("- tied for second place");
    tiebreaker = [checkPoints[1], checkPoints[2]];
  }
  if (!firstPlace && checkPoints[1].points !== checkPoints[2]?.points) {
    // B. is third place unique?
    log("- tied for first place");
    tiebreaker = [checkPoints[0], checkPoints[1]];
    if (checkPoints[2]?.playerId) {
      thirdPlace = lobbies[lobbyCode].players
        .filter((p: any) => p.pid === checkPoints[2].playerId)
        .pop();
    }
  }
  if (!tiebreaker) {
    // C. does everyone have the same score ?
    log("- everyone tied!");
    tiebreaker = checkPoints;
  }
  // create a timestamp
  const finaleTime = Date.now();
  // [...playerIds]
  const matchPID = tiebreaker.map((item: any) => item?.playerId);
  // filtered [...lobby.players]
  const matchPlayers = lobbies[lobbyCode].players.filter((p: any) =>
    matchPID.includes(p.pid)
  );
  // linear sort [...lobby.players]
  const topThree = matchPlayers
    .map((p: any) => {
      return {
        ...p,
        timeDelta: finaleTime - p?.definitionEpoch || Math.random(),
      };
    })
    .sort(function (a: any, b: any) {
      return b.timeDelta - a.timeDelta;
    });

  if (firstPlace?.pid && !thirdPlace?.pid) {
    // A.
    topThree.unshift(firstPlace);
  }

  if (thirdPlace?.pid && !firstPlace?.pid) {
    // B.
    topThree.push(thirdPlace);
  }
  return await doIt(
    game_id,
    topThree[0],
    topThree[1] || undefined,
    topThree[2] || undefined
  );
}
