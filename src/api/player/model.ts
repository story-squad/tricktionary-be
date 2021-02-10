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
async function updatePlayer(player_id: string, changes: any) {
  const validUpdate = validatePlayerType({ id: player_id, ...changes });
  if (!validUpdate.ok) {
    return { ok: false, message: validUpdate.message };
  }
  try {
    const player = await db("Player")
      .where({ id: player_id })
      .update(changes)
      .returning("*");
    return player[0];
  } catch (err) {
    return { ok: false, message: err.messge };
  }
}

function getPlayer(player_id: string) {
  return db("Player").where({ id: player_id }).first();
}
async function findPlayer(col_name: string, value: any) {
  const player = await db("Player").where({ [col_name]: value }).first();
  return player;
}

export default { newPlayer, updatePlayer, getPlayer, findPlayer };
