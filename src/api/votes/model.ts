import db from "../../dbConfig";
import { validateVote } from "./utils";

export async function add(userID: string, definitionID: any, roundID: number) {
  const result = validateVote({
    user_id: userID,
    definition_id: definitionID === 0 ? null : definitionID,
    round_id: roundID
  });
  if (!result.ok) {
    return console.log(result.message);
  }
  const [voteId] = await db("Votes").insert(result.value).returning("id");
  return voteId
}

export default { add };
