import db from "../../dbConfig";
import { validateVote } from "./utils";

export function add(userID: string, definitionID: any, roundID: number) {
  const result = validateVote({
    user_id: userID,
    definition_id: definitionID,
    round_id: roundID
  });
  if (!result.ok) {
    return console.log(result.message);
  }
  return db("Votes").insert(result.value);
}

export default { add };
