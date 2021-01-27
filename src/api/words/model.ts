import db from "../../dbConfig";

export default { getByName, getById, add, getUnmoderatedWord, getApprovedWords, update };

function getById(id: number) {
  return db("Words").where({ id }).first();
}

function getByName(name: string) {
  return db("Words").where({ word:name }).first();
}

function add(word: object) {
  return db("Words").insert(word).returning("id");
}

function getUnmoderatedWord() {
  return db("Words").where({ moderated: false }).first();
}

function getApprovedWords() {
  return db("Words").where({ moderated: true, approved: true });
}

async function update(id: number, changes: object) {
  await db("Words")
    .where({ id })
    .update(changes);
  return getById(id);
}
