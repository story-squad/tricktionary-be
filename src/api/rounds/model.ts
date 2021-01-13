import db from "../../dbConfig";
import { validateRound } from "./utils";

export function add(gameState: any, wordId: number) {
  const newRound = validateRound({
    word_id: wordId,
    number_players: gameState.players.length
  });
  return newRound.ok
    ? db("Rounds").insert(newRound.value).returning("id")
    : newRound.message;
}

export function roundFinished(roundId: number) {
  return db("Rounds").where({ id: roundId }).update({ ended_at: db.fn.now() });
}
