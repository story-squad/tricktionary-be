import db from "../../dbConfig";

export default { getByName, getById, add, getUnmoderatedWord, getApprovedWords, update, getUnmoderatedWordIds, getApprovedWordIds };

function getById(id: number) {
  return db("words").where({ id }).first();
}

function getByName(name: string) {
  return db("words").where({ word:name }).first();
}

function add(word: object) {
  return db("words").insert(word).returning("id");
}

function getUnmoderatedWord() {
  return db("words").where({ moderated: false }).first();
}

function getApprovedWords() {
  return db("words").where({ moderated: true, approved: true });
}

function getApprovedWordIds() {
  return db("words").select("id").where({ moderated: true, approved: true })
}

function getUnmoderatedWordIds() {
  return db("words").select("id").where({ moderated: false, approved: false })
}

async function update(id: number, changes: object) {
  await db("words")
    .where({ id })
    .update(changes);
  return getById(id);
}
