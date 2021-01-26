const wordlist = [
  {
    "testing-tricktionary": "user-words table"
  },
]
const INSERT_MAX = 1;

const words = wordlist.map((pair) => {
  const [[word, definition]] = Object.entries(pair);
  return {
    word,
    definition,
    score: 0,
    approved: false
  };
});

exports.seed = async function (knex) {
  let total = words.length;
  let start = 0;
  let errors = 0;
  let inserts = 0;
  while (total > 0) {
    let finish = start + INSERT_MAX;
    let chunk = words.slice(start, finish);
    console.log(`${start} -> ${finish}`);
    total -= chunk.length;
    start += chunk.length;
    try {
      await knex("User-Words").insert(chunk);
      inserts += 1;
    } catch (err) {
      // console.log(err)
      errors += 1;
    }
  }
  console.log({ seed: "user-words", errors, inserts });
  return true;
};
