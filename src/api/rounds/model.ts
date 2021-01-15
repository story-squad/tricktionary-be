import db from "../../dbConfig";
import { validateRound } from "./utils";

function add(gameState: any, wordId: number) {
  const newRound = validateRound({
    word_id: wordId,
    number_players: gameState.players.length
  });
  return newRound.ok
    ? db("Rounds").insert(newRound.value).returning("id")
    : newRound.message;
}

function roundFinished(roundId: number) {
  // timestamp when this round finished.
  return db("Rounds").where({ id: roundId }).update({ ended_at: db.fn.now() });
}

export default { add, roundFinished };
