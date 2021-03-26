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
  getDef,
  doIt,
  tieBreakerMatch
};

type topThreeListItem = {
  user_id: string;
  definition: string;
  word: string;
};

function finalFormat(defRecord: any): topThreeListItem {
  const { user_id, definition, def_word } = defRecord;
  const { word } = def_word;
  return { user_id, definition, word };
}

async function getDef(user_id: string, game_id: string, player_id: string) {
  let result: any = { id: user_id, game: game_id };
  let mvr: any[];
  let mvd: any;
  let r: any;
  let wid: number;
  let rWord: any;
  let def_word: any;
  let updateScoreCard: any;
  try {
    let p = await localAxios.get(
      `/api/user-rounds/user/${result.id}/game/${result.game}`
    );
    result["user_rounds"] = p.data.user_rounds;
    // most voted round
    mvr = result.user_rounds.sort(function (a: any, b: any) {
      return b.votes - a.votes;
    })[0].round_id;
    // most voted definition
    mvd = await localAxios.get(
      `/api/definitions/user/${result.id}/round/${mvr}`
    );
    
    if (mvd?.data?.id) {
      updateScoreCard = await localAxios.put(`/api/score/def/${player_id}`, {
        game_id,
        top_definition_id: mvd.data.id,
      });
    }
    r = await localAxios.get(`/api/round/id/${mvr}`);
    wid = r.data.round.word_id;
    rWord = await localAxios.get(`/api/words/id/${wid}`);
    def_word = rWord.data.word;
  } catch (err) {
    log(err.message);
    return;
  }
  return finalFormat({ ...mvd.data.definition, user_id, def_word });
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

async function checkScores(lobbyCode: string, lobbies: any) {
  const players = lobbies[lobbyCode]?.players;
  const host = lobbies[lobbyCode].host
  const game_id = lobbies[lobbyCode].game_id;
  if (!players) {
    log(`[!ERROR] no players in ${lobbyCode}`);
    return { ok: false, error: `invalid lobby @ ${lobbyCode}` };
  }
  // add host to list
  log(`updating score-cards for players in ${lobbyCode}`);
  return await [...players, {}].forEach(async (playerObj: any) => {
    const socket_id = playerObj.id;
    const { definitionId, points, username, pid } = playerObj;
    const pathname = `/api/score/player/${pid}/game/${game_id}`;
    let score = await localAxios.get(pathname);
    if (!score.data.id) {
      log(`creating score card for ${username}`);
      score = await localAxios.post("/api/score/new", {
        game_id,
        player_id: pid,
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
  } catch (err) {
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
  let r = [];
  // get most voted definition(s)
  try {
    const firstPlaceResult = await getDef(
      firstPlace.id,
      game_id,
      firstPlace.pid
    );
    r.push({ ...firstPlaceResult });
  } catch (err) {
    log("error getting 1st place");
    log(err.message);
  }
  if (secondPlace) {
    try {
      const secondPlaceResult = await getDef(
        secondPlace.id,
        game_id,
        secondPlace.pid
      );
      r.push({ ...secondPlaceResult });
    } catch (err) {
      log("error getting second place");
      log(err.message);
    }
  }
  if (thirdPlace) {
    try {
      const thirdPlaceResult = await getDef(
        thirdPlace.id,
        game_id,
        thirdPlace.pid
      );
      r.push({ ...thirdPlaceResult });
    } catch (err) {
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
      .filter((p: any) => p.pid === checkPoints[0].player_id)
      .pop();
    log("- tied for second place");
    tiebreaker = [checkPoints[1], checkPoints[2]];
  }
  if (!firstPlace && checkPoints[1].points !== checkPoints[2]?.points) {
    // B. is third place unique?
    log("- tied for first place");
    tiebreaker = [checkPoints[0], checkPoints[1]];
    if (checkPoints[2]?.player_id) {
      thirdPlace = lobbies[lobbyCode].players
        .filter((p: any) => p.pid === checkPoints[2].player_id)
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
  // [...player_ids]
  const matchPID = tiebreaker.map((item: any) => item?.player_id);
  // filtered [...lobby.players]
  const matchPlayers = lobbies[lobbyCode].players.filter((p: any) =>
    matchPID.includes(p.pid)
  );
  // linear sort [...lobby.players]
  const withDelta = matchPlayers
    .map((p: any) => {
      return {
        ...p,
        timeDelta: finaleTime - p?.definitionEpoch || Math.random(),
      };
    })
    .sort(function (a: any, b: any) {
      return b.timeDelta - a.timeDelta;
    });
  // placeholder array
  let topThree = [];
  if (firstPlace && !thirdPlace) {
    // A.
    topThree = [firstPlace, ...withDelta];
  } else if (thirdPlace && !firstPlace) {
    // B.
    topThree = [...withDelta, thirdPlace];
  } else {
    // C.
    topThree = withDelta;
  }
  return await doIt(
    game_id,
    topThree[0],
    topThree[1] || undefined,
    topThree[2] || undefined
  );
}
