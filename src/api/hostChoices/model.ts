import db from "../../dbConfig";
import { validateHostChoice } from "./utils";

export default { addHostChoice, getHostChoiceById };

async function addHostChoice(
  word_id_one: number,
  word_id_two: number,
  round_id: number,
  times_shuffled: number
) {
  // validate object.property types
  const newHostChoice = validateHostChoice({
    word_id_one,
    word_id_two,
    round_id,
    times_shuffled,
  });
  return newHostChoice.ok
    ? db("host-choices").insert(newHostChoice.value).returning("id")
    : [-1, newHostChoice.message];
}

async function getHostChoiceById(id: number) {
  return db("host-choices").where({ id }).first();
}
