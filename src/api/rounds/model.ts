import db from "../../dbConfig";
import { validateRound } from "./utils";
// import { log } from "../../logger";
function add(gameState: any, wordId: number, lobbyCode: string) {
  const newRound = validateRound({
    word_id: wordId,
    number_players: gameState.players.length,
    spoilers: lobbyCode,
  });
  return newRound.ok
    ? db("Rounds").insert(newRound.value).returning("id")
    : newRound.message;
}

function get(roundId: number) {
  return db("Rounds").where({ id: roundId }).first();
}

function roundFinished(roundId: number) {
  // timestamp when this round finished.
  return db("Rounds").where({ id: roundId }).update({ ended_at: db.fn.now() });
}

export default { add, get, roundFinished };
