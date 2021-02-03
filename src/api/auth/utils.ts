type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface AuthorizedPlayer {
  sub: string; // socket.id
  pid: string; // player.id
  iat: number; // timestamp or 0
  exp: number | undefined; // timestamp
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
