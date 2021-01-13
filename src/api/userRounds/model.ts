import db from "../../dbConfig";
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
export function add(userID: string, roundID: number) {
  return db("User-Rounds").insert({ user_id:userID, round_id:roundID });
}
