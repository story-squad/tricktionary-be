import db from "../../dbConfig";

export function add(
  userId: string,
  roundID: number,
  reactionID: number,
  definitionID: number,
  gameFinished: boolean
) {
  return db("Definition-Reactions")
    .insert({
      user_id: userId,
      round_id: roundID,
      reaction_id: reactionID,
      definition_id: definitionID,
      game_finished: gameFinished
    })
    .returning("id");
}

export function getByRound(roundID: number) {
  return db("Definition-Reactions").where({ round_id: roundID });
}

export function getByUser(userID: string) {
  return db("Definition-Reactions").where({ user_id: userID });
}

export function getByReaction(reactionID: number) {
  return db("Definition-Reactions").where({ reaction_id: reactionID });
}

export function getByDefinition(definitionID: number) {
  return db("Definition-Reactions").where({ definition_id: definitionID });
}

export function getFinished() {
  return db("Definition-Reactions").where({ game_finished: true });
}

export function getUnfinished() {
  return db("Definition-Reactions").where({ game_finished: false });
}
