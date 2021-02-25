import { idText } from "typescript";
import db from "../../dbConfig";

export default {
  getRound,
  getWordDetails,
  getDefinitionDetails,
  getTopVotedDefinitions,
};

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

async function getWordDetails(word_id: number) {
  //get word
  const word: any = await db("Words").where({ id: word_id });
  //get rounds with word
  const rounds: Array<any> = await db("Rounds").where({ word_id });
  //get definitions for each round
  let definitions: Array<any> = [];
  rounds.forEach(async (round) => {
    let defs: Array<any> = await db("Definitions").where({
      round_id: round.id,
    });
    definitions = [...definitions, ...defs];
  });
  //get passovers for word
  let choices_with_word: Array<any> = [];
  const choices_one: Array<any> = await db("host-choices").where({
    word_id_one: word_id,
  });
  const choices_two: Array<any> = await db("host-choices").where({
    word_id_two: word_id,
  });
  choices_with_word = [...choices_one, ...choices_two];

  return {
    word: word,
    rounds_picked: rounds,
    definitions: definitions,
    passovers: choices_with_word,
  };
}

async function getDefinitionDetails(definition_id: number) {
  //get definition by id
  const definition: any = await db("Definitions")
    .where({ id: definition_id })
    .first();
  //get all votes by definition id
  const votes: Array<any> = await db("Votes").where({ definition_id });
  //get num of players from round
  const round: any = await db("Rounds")
    .where({ id: definition.round_id })
    .first();
  //get any reactions from the join table
  const reactions: Array<any> = await db("Definition-Reactions").where({
    definition_id,
  });
  return {
    definition: definition,
    votes: votes,
    num_players: round.number_players,
    reactions: reactions,
  };
}

//function that loops over all the definitions, and returns all of them sorted by most votes

async function getAllDefinitions() {
  const allDefs: Array<any> = await db("Definitions");
  let allDefDeets: Array<any> = [];
  for (let def of allDefs) {
    const defDeets: any = await getDefinitionDetails(def.id);
    allDefDeets.push(defDeets);
  }
  return allDefDeets;
}

async function getTopVotedDefinitions() {
  const defs = await getAllDefinitions();
  let res: Array<any> = [];
  for (let def of defs) {
    if (def.votes.length >= 1) {
      res.push(def);
    }
  }
  res.sort((a, b) => {
    if (a.votes.length < b.votes.length) return 1;
    if (b.votes.length < a.votes.length) return -1;
    return 0;
  });
  res.slice(0, 49);
  return res;
}
