import db from "../../dbConfig";
import { validateHostChoice } from "./utils";

export default { getRound, addHostChoice, getHostChoiceById };

/**
 * Round round get around, I get around, yeah
 * (Get around round round I get around, ooh-ooh) I get around
 * From town to town (get around round round I get around)
 * I'm a real cool head (get around round round I get around)
 * I'm makin' real good bread (get around round round I get around)
 * @param roundId number
 */
async function getRound(roundId: number) {
  const definitions: any = await db("Definitions").where({ round_id: roundId });
  const definitionReactions: any = await db("Definition-Reactions").where({
    round_id: roundId,
  });
  // I'm gettin' bugged driving up and down the same old strip
  // I gotta find a new place where the kids are hip
  const players: any = await db("User-Rounds").where({ round_id: roundId });
  // My buddies and me are getting real well known
  // Yeah, the bad guys know us and they leave us alone
  const votes: any = await db("Votes").where({ round_id: roundId });
  // I get around (get around round round I get around)
  const round: any = await db("Rounds").where({ id: roundId }).first();
  // From town to town (get around round round I get around)
  const word: any = await db("Words").where({ id: round.word_id }).first();
  // I'm a real cool head (get around round round I get around)
  // I'm makin' real good bread (get around round round I get around)
  const choices: any = await db("host-choices")
    .where({ round_id: roundId })
    .first();
  return {
    word,
    round,
    players,
    definitions,
    definitionReactions,
    votes,
    choices,
  };
}

async function addHostChoice(
  word_id_one: number,
  word_id_two: number,
  round_id: number,
  times_shuffled: number
) {
  // validate object.property types
  const newHostChoice = validateHostChoice({
    word_id_one,
    word_id_two,
    round_id,
    times_shuffled,
  });
  return newHostChoice.ok
    ? db("host-choices").insert(newHostChoice.value).returning("id")
    : [-1, newHostChoice.message];
}

async function getHostChoiceById(id: number) {
  return db("host-choices").where({ id }).first();
}
