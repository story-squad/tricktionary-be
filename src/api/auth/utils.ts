import jwt from "jsonwebtoken";
import { updatePlayer } from "../player/model";
import secrets from "./secrets";

type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface AuthorizedPlayer {
  sub: string; // socket.id
  pid: string; // player.id
  iat: number; // timestamp or 0
  exp: number | undefined; // timestamp
  ext: string | undefined; // lobby code
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
    }
  }
  return { ok: true, value: payload }; // as-is
}

function generateToken(user_id: string, player_id: string, extra:string|undefined) {
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
export async function newToken(last_user_id: string, player_id: string, extra: string| undefined) {
  let token;
  const payload = validatePayloadType({
    sub: last_user_id,
    pid: player_id,
    iat: 0,
    ext: extra
  });
  if (!payload.ok) {
    return {ok: false, message: "bad payload", status: 400 };
  }
  try {
    token = await generateToken(last_user_id, player_id, extra); // generate new token
    await updatePlayer(player_id, { token, last_user_id }); // update the player record
  } catch (err) {
    return { ok: false, message: err.message, status: 400 }
  }
  return { ok: true, token, message: "token update", status: 200 }
}
