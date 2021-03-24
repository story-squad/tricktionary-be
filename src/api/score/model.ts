import db from "../../dbConfig";
import { v4 } from "uuid";
// import { log } from "../../logger";

async function scoreCard(player_id: string, game_id: string) {
  const uuId = v4();
  try {
    await db("score").insert({ id: uuId, player_id, game_id });
  } catch (err) {
    return { ok: false, message: err.message };
  }
  return { ok: true, id: uuId };
}
async function getPlayerScore(player_id: string, game_id: string) {
  let result;
  try {
    result = await db("score").where({ player_id, game_id }).first();
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  return result;
}

async function getGames(player_id: string) {
  //
  let result;
  try {
    result = await db("score").where({ player_id }).returning("game_id");
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  return result;
}

async function getPlayers(game_id: string) {
  //
  let result;
  try {
    result = await db("score").where({ game_id }).returning("player_id");
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  return result;
}

async function addPoints(player_id: string, game_id: string, points: number) {
  try {
    // update players points
    const result = await db("score")
      .where({ game_id, player_id })
      .increment("points", points)
      .returning("points");
    return { ok: true, points: result };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function subPoints(player_id: string, game_id: string, points: number) {
  try {
    // update players points
    const result = await db("score")
      .where({ game_id, player_id })
      .decrement("points", points)
      .returning("points");
    return { ok: true, points: result };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

export { scoreCard, getGames, getPlayers, addPoints, subPoints, getPlayerScore };
