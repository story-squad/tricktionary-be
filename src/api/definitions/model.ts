import db from "../../dbConfig";
import { validateDefinition } from "./utils";

export default {
  add,
  byUserInRound,
  byPlayerInRound,
  incr,
  decr,
  thisRound,
  findTopDefinition,
  byId,
};

function add(
  userID: string,
  playerID: string,
  definition: string | null,
  roundID: number,
  gameID: string
) {
  // validate object.property types
  const newDefinition = validateDefinition({
    user_id: userID,
    playerId: playerID,
    definition,
    round_id: roundID,
    game_id: gameID,
  });
  return newDefinition.ok
    ? db("definitions").insert(newDefinition.value).returning("id")
    : [-1, newDefinition.message];
}

function byUserInRound(user_id: string, round_id: number) {
  return db("definitions").where({ user_id, round_id }).first();
}

function byId(definitionId: number) {
  return db("definitions").where({ id: definitionId });
}

function byPlayerInRound(playerId: string, round_id: number) {
  return db("definitions").where({ playerId, round_id }).first();
}
function thisRound(round_id: number) {
  return db("definitions").where({ round_id });
}
async function incr(playerId: string, round_id: number, points: number) {
  return await db("definitions")
    .where({ playerId, round_id })
    .increment("score", points)
    .returning("score");
}

async function decr(playerId: string, round_id: number, points: number) {
  return await db("definitions")
    .where({ playerId, round_id })
    .decrement("score", points)
    .returning("score");
}

async function findTopDefinition(playerId: string, game_id: string) {
  let top_definition;
  try {
    top_definition = await db("definitions")
      .where({ playerId, game_id })
      .orderBy("score", "desc")
      .first();
  } catch (err:any) {
    return { ok: false, error: err.message };
  }
  return { ok: true, top_definition };
}
