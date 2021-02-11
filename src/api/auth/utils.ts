import jwt from "jsonwebtoken";
import Player from "../player/model";
import UserRound from "../userRounds/model";
import Rounds from "../rounds/model";

import secrets from "./secrets";
import { exit } from "process";

type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface AuthorizedPlayer {
  sub: string; // socket.id
  pid: string; // player.id
  iat: number; // timestamp or 0
  exp: number | undefined; // timestamp
  ext: string | undefined; // extra information
}

export function validatePayloadType(payload: any): Result<AuthorizedPlayer> {
  if (typeof payload.sub !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof payload.sub}`
    };
  }
  if (typeof payload.pid !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof payload.pid}`
    };
  }
  if (typeof payload.iat !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof payload.iat}`
    };
  }
  return { ok: true, value: payload }; // as-is
}

function generateToken(
  user_id: string,
  player_id: string,
  extra: string | undefined
) {
  const payload = {
    sub: user_id,
    pid: player_id,
    iat: Date.now(),
    ext: extra
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

/**
 * create a new token for the player.
 *
 * @param last_user_id socket.id
 * @param player_id Player.id
 */
export async function newToken(
  last_user_id: string,
  player_id: string,
  extra: string | undefined
) {
  const payload = validatePayloadType({
    sub: last_user_id,
    pid: player_id,
    iat: 0,
    ext: extra
  });
  if (!payload.ok) {
    return { ok: false, message: "bad payload", status: 400 };
  }
  try {
    const token = await generateToken(last_user_id, player_id, extra); // generate new token
    await Player.updatePlayer(player_id, { token, last_user_id }); // update the player record
    return { ok: true, token, message: "token update", status: 200 };
  } catch (err) {
    return { ok: false, message: err.message, status: 400 };
  }
}

// encode a string in Base64
const encode64 = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

// decode a string from Base64
const decode64 = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

export const b64 = { encode: encode64, decode: decode64 };
/**
 * @returns player_id, last_user_id (from JWT)
 * @param token JWT
 *
 */
export function partialRecall(token: string) {
  // get player_id & last user_id from the JWT
  const payload = validatePayloadType(jwt.decode(token));
  if (!payload.ok) return { ok: false, message: payload.message };
  let username;
  let definition;
  let points;
  if (payload.value.ext) {
    const extra: any = b64.decode(payload.value.ext);
    username = extra.username;
    definition = extra.definition;
    points = extra.points;
  }
  return {
    ok: true,
    last_user_id: payload.value.sub,
    player_id: payload.value.pid,
    username,
    definition,
    points
  };
}
export async function totalRecall(player_id: string | undefined) {
  let result;
  let player:any;
  try {
    player = await Player.getPlayer(String(player_id));
    result = { ok: true, player, lobby: undefined };
  } catch (err) {
    result = {
      ok: false,
      message: err.message,
      lobby: undefined,
      player: undefined
    };
  }
  if (result.ok) {
    // ok, we found the user, now find their last lobby (if it exists)
    try {
      const { round_id } = await UserRound.findLastRound(
        result.player.last_user_id
      );
      const last_round = await Rounds.get(round_id);
      // note: My decision to store the lobby code here was convenient.
      //   I created the spoilers field to store potentially unwanted words from each player.
      //   we have not written that feature yet, so I placed the lobbycode there.
      const { spoilers } = last_round;
      if (spoilers) {
        return { ok: true, player: result.player, spoilers };
      }
    } catch (err) {
      console.log("cannot find a last_lobby of player.");
      return {
        ok: true,
        message: err.message,
        spoilers: undefined,
        player
      };
    }
  }
  return result;
}

export async function verifyTricktionaryToken(
  last_token: string,
  last_user_id: string
) {
  let last_lobby;
  let player_id: string| undefined;
  let player;
  try {
    jwt.verify(last_token, secrets.jwtSecret); // verify it's one of ours.
    let mem = partialRecall(last_token);
    if (!mem.ok) {
      return { ok: false, status: 400, message: mem.message };
      // res.status(400).json({ message: mem.message });
    }
    player_id = mem.player_id ? mem.player_id : ""; // remember the player_id ?
    if (last_user_id === mem.last_user_id) {
      // same web socket session, update token and return.
      console.log("same socket");
    }
    const existing = await totalRecall(mem.player_id);
    if (existing.ok) {
      player = existing.player;
      last_lobby = existing.spoilers;
      console.log("last lobby -", last_lobby);
    } else {
      console.log("can't find this player in the db");
      // console.log(existing);
    }
  } catch (err) {
    return { ok: false, status: 403, message: err.message };
  }
  return {
    ok: true,
    status: 200,
    player,
    last_lobby,
    old_user_id: last_user_id,
    player_id
  };
}
