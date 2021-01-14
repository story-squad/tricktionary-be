const reactionList = require("../resources/reactions.json");

exports.seed = async function (knex) {
  let idx = 0;
  let errors = 0;
  while (idx < reactionList.length) {
    let content = reactionList[idx];
    try {
      await knex("Reactions").insert({ content });
    } catch (err) {
      errors += 1;
    }
    idx += 1;
  }
  console.log({ seed: "reactions.json", errors, inserts: idx });
  return true;
};
