type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface PlayerUpdate {
  id: string; // uuid (player_id)
  token: string | undefined; // jwt
  last_played: string | undefined; // current game
  last_user_id: string | undefined; //socket.id
  jump_code: string | undefined;
  name: string | undefined;
}

export function validatePlayerType(player: any): Result<PlayerUpdate> {
  if (typeof player.id !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.sub}`
    };
  }
  if (player.token && typeof player.token !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.token}`
    };
  }
  if (player.game_id && typeof player.game_id !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.game_id}`
    };
  }
  if (player.user_id && typeof player.user_id !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.user_id}`
    };
  }
  if (player.jump_code && typeof player.jump_code !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.jump_code}`
    };
  }
  if (player.name && typeof player.name !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof player.name}`
    };
  }
  return { ok: true, value: player }; // as-is
}
