import db from "../../dbConfig";
import { validatePlayerType } from "./utils";
import { v4 } from "uuid";
import { matchWords } from "../../options/pseudoRandom";

export default {
  newPlayer,
  updatePlayer,
  getPlayer,
  findPlayer,
  bySocketID,
  getName,
  nameCheck,
};

async function newPlayer(user_id: string) {
  const uuId = v4();
  try {
    await db("Player").insert({ id: uuId, last_user_id: user_id });
  } catch (err: any) {
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
  } catch (err: any) {
    return { ok: false, message: err.messge };
  }
}

function bySocketID(last_user_id: string) {
  return db("Player").where({ last_user_id }).first();
}
async function getPlayer(player_id: string) {
  return await db("Player").where({ id: player_id }).first();
}
async function findPlayer(col_name: string, value: any) {
  return await db("Player")
    .where({ [col_name]: value })
    .first();
}

async function getName(player_id: string) {
  return await db("Player").select("name").where({ id: player_id }).first();
}

async function nameCheck(username: string, last_played: string) {
  const players = await db("Player").where({ last_played });
  const player_names = players.map((p: any) => p.name.toLowerCase());
  const check = matchWords(username.toLowerCase(), player_names);
  return check.length > 0;
}
