import db from "../../dbConfig";
import { validateDefinition } from "./utils";

export function add(userID: string, definitionID: number, roundID: number) {
  // validate object.property types
  const newDefinition = validateDefinition({
    user_id: userID,
    definition_id: definitionID,
    round_id: roundID
  });
  return newDefinition.ok
    ? db("Definitions").insert(newDefinition.value).returning("id")
    : newDefinition.message;
}
