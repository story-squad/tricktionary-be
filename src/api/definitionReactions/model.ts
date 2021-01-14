import db from "../../dbConfig";
export default {
  add,
  getByReaction,
  getByRound,
  getByDefinition,
  getByUser,
  getFinished,
  getUnfinished
}

function add(
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

function getByRound(roundID: number) {
  return db("Definition-Reactions").where({ round_id: roundID });
}

function getByUser(userID: string) {
  return db("Definition-Reactions").where({ user_id: userID });
}

function getByReaction(reactionID: number) {
  return db("Definition-Reactions").where({ reaction_id: reactionID });
}

function getByDefinition(definitionID: number) {
  return db("Definition-Reactions").where({ definition_id: definitionID });
}

function getFinished() {
  return db("Definition-Reactions").where({ game_finished: true });
}

function getUnfinished() {
  return db("Definition-Reactions").where({ game_finished: false });
}
