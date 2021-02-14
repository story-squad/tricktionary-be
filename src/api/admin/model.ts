import db from "../../dbConfig";

export default {
  getRound,
  getPassoversForWord,
  getDefinitionDetails,
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

async function getPassoversForWord(word_id: number) {
  let choices_with_word: Array<any> = [];
  const choices_one: Array<any> = await db("host-choices").where({
    word_id_one: word_id,
  });
  const choices_two: Array<any> = await db("host-choices").where({
    word_id_two: word_id,
  });
  choices_with_word = [...choices_one, ...choices_two];
  return choices_with_word;
}

async function getDefinitionDetails(definition_id: number) {
  //get definition by id
  const definition: any = await db("Definitions").where({ definition_id });
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
