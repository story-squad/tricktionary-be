import db from "../../dbConfig";
import { validateDefinition } from "./utils";

export default { add, byUserInRound, byPlayerInRound, incr, decr, thisRound, findTopDefinition };

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
    player_id: playerID,
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

function byPlayerInRound(player_id: string, round_id: number) {
  return db("definitions").where({ player_id, round_id }).first();
}
function thisRound(round_id: number) {
  return db("definitions").where({ round_id });
}
async function incr(player_id: string, round_id: number, points: number) {
  return await db("definitions")
    .where({ player_id, round_id })
    .increment("score", points)
    .returning("score");
}

async function decr(player_id: string, round_id: number, points: number) {
  return await db("definitions")
    .where({ player_id, round_id })
    .decrement("score", points)
    .returning("score");
}

async function findTopDefinition(player_id: string, game_id: string) {
  let top_definition;
  try {
    top_definition = await db("definitions")
      .where({ player_id, game_id })
      .orderBy("score", "desc")
      .first();
  } catch (err) {
    return { ok: false, error: err.message };
  }
  return { ok: true, top_definition };
}
