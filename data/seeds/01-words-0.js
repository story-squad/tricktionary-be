// words from Qi Series 10 Episode 01
const words = [
  { jentacular: "Pertaining to breakfast" },
  { jollop: "A strong liquor" },
  {
    jankers:
      "In the British Armed Services, jankers or Restrictions of Privileges is an official punishment for a minor breach of discipline, as opposed to the more severe punishment of detention which would be given for committing a more serious or criminal offence."
  },
  { jollocks: "Victorian insult: it means someone who is overweight." }
].map((pair) => {
  const [[word, definition]] = Object.entries(pair);
  return {
    word,
    definition,
    approved: true,
    moderated: true
  };
});

exports.seed = function (knex) {
  return knex("Words").insert(words)
};
