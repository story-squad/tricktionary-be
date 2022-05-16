import db from "../../dbConfig";
import { v4 } from "uuid";
// import { log } from "../../logger";
export {
  updateDefinition,
  scoreCard,
  getGames,
  getPlayers,
  addPoints,
  subPoints,
  getPlayerScore,
  getLatest,
  findTopDefinition,
};

async function scoreCard(playerId: string, gameId: string) {
  const uuId = v4();
  try {
    await db("score").insert({ id: uuId, playerId, game_id: gameId });
  } catch (err:any) {
    if (err instanceof Error) return { ok: false, message: err.message };
  }
  return { ok: true, id: uuId };
}
async function getPlayerScore(playerId: string, gameId: string) {
  let result;
  try {
    result = await db("score").where({ playerId, game_id: gameId }).first();
  } catch (err:any) {
    if (err instanceof Error) result = { ok: false, message: err.message };
  }
  return result;
}

async function getGames(playerId: string) {
  //
  let result;
  try {
    result = await db("score").where({ playerId }).returning("game_id");
  } catch (err:any) {
    if (err instanceof Error) result = { ok: false, message: err.message };
  }
  return result;
}
async function getLatest(gameId: string) {
  let result: any;
  try {
    result = await db("score").where({ game_id: gameId });
  } catch (err:any) {
    result = [];
  }
  return { ok: true, latest: result };
}
async function getPlayers(gameId: string) {
  //
  let result;
  try {
    result = await db("score").where({ game_id: gameId }).returning("playerId");
  } catch (err:any) {
    if (err instanceof Error) result = { ok: false, message: err.message };
  }
  return result;
}

async function addPoints(playerId: string, gameId: string, points: number) {
  try {
    // update players points
    const result = await db("score")
      .where({ game_id: gameId, playerId })
      .increment("points", points)
      .returning("points");
    return { ok: true, points: result };
  } catch (err:any) {
    if (err instanceof Error) return { ok: false, message: err.message };
  }
}

async function subPoints(playerId: string, gameId: string, points: number) {
  try {
    // update players points
    const result = await db("score")
      .where({ game_id: gameId, playerId })
      .decrement("points", points)
      .returning("points");
    return { ok: true, points: result };
  } catch (err:any) {
    if (err instanceof Error) return { ok: false, message: err.message };
  }
}

async function updateDefinition(
    playerId: string,
    gameId: string,
    topDefinitionId: number
) {
  try {
    const result = await db("score")
      .where({ game_id: gameId, playerId })
      .update({ top_definition_id: topDefinitionId });
    return { ok: true, score: result };
  } catch (err:any) {
    if (err instanceof Error) return { ok: false, error: err.message };
  }
}

async function findTopDefinition(playerId: string, gameId: string) {
  let topDefinition;
  try {
    topDefinition = await db("definitions")
      .where({ playerId, game_id: gameId })
      .orderBy("score", "desc")
      .first();
  } catch (err:any) {
    if (err instanceof Error) return { ok: false, error: err.message };
  }
  return { ok: true, top_definition: topDefinition };
}
