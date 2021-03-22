import db from "../../dbConfig";
import { v4 } from "uuid";
// import { log } from "../../logger";

async function scoreCard(player_id: string, game_id: string) {
  const uuId = v4();
  try {
    await db("Played").insert({ id: uuId, player_id, game_id });
  } catch (err) {
    return { ok: false, message: err.message };
  }
  return { ok: true, played: uuId };
}

async function getGames(player_id: string) {
  //
  let result;
  try {
    result = await db("Played").where({ player_id }).returning("game_id");
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  return result;
}

async function getPlayers(game_id: string) {
  //
  let result;
  try {
    result = await db("Played").where({ game_id }).returning("player_id");
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  return result;
}

export { scoreCard, getGames, getPlayers };
