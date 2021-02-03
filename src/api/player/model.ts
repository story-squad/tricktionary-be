import db from "../../dbConfig";
import { validatePlayerType } from "./utils";
import { v4 } from "uuid";

async function newPlayer(user_id: string) {
  const uuId = v4();
  try {
    await db("Player").insert({ id: uuId, last_user_id: user_id });
  } catch (err) {
    return { ok: false, message: err.message };
  }
  return { ok: true, player_id: uuId };
}
// update with "last_user_id"
async function updatePlayer(player_id: string, update: any) {
  const validUpdate = validatePlayerType({ id: player_id, ...update });
  if (!validUpdate.ok) {
    return validUpdate.message;
  }
  const player = await getPlayer(player_id);
  return player;
}

async function getPlayer(player_id: string) {
  return db("Player").where({ id: player_id }).first();
}

export { newPlayer, updatePlayer, getPlayer };
