import db from "../../dbConfig";

export function add(user_id: number, round_id: number) {
  return db("User-Rounds").insert({ user_id, round_id });
}
