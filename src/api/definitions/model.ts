import db from "../../dbConfig";
import { validateDefinition } from "./utils";

function add(userID: string, definition: string | null, roundID: number) {
  // validate object.property types
  const newDefinition = validateDefinition({
    user_id: userID,
    definition,
    round_id: roundID
  });
  return newDefinition.ok
    ? db("Definitions").insert(newDefinition.value).returning("id")
    : [ -1, newDefinition.message ];
}

export default {add}