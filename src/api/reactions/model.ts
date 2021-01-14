import db from "../../dbConfig";

export function add(content: string) {
  return db("Reactions").insert({ content }).returning("id");
}

export function getAll() {
  return db("Reactions")
}

export function getById(id: number) {
  return db("Reactions").where({ id }).first();
}