import db from "../../dbConfig";
import { validateVote } from "./utils"

export function add(user_id: string, definition_id: any, round_id: number) {
  const result = validateVote({ user_id, definition_id, round_id })
  if (!result.ok) {
    return console.log(result.message)
  }
  return db("Votes").insert(result.value)
}