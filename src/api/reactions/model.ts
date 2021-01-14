import db from "../../dbConfig";

export default { add, getAll, getById };

function add(content: string) {
  return db("Reactions").insert({ content }).returning("id");
}

function getAll() {
  return db("Reactions").select("id", "content").then(records => {
    return records
  });
}

function getById(id: number) {
  return db("Reactions").where({ id }).first();
}
