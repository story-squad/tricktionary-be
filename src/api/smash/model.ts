import db from "../../dbConfig";
// import { log } from "../../logger";
export { add, get, incr, updateCount, bulkUpdate };

function add(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number,
  value?: number
) {
  return db("Smash")
    .insert({
      game_id,
      round_id,
      definition_id,
      reaction_id,
      count: value || 1
    })
    .returning("count");
}

async function get(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number
) {
  return await db("Smash")
    .where({
      game_id,
      round_id,
      definition_id,
      reaction_id
    })
    .returning("count");
}

async function incr(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number
) {
  return await db("Smash")
    .where({
      game_id,
      round_id,
      definition_id,
      reaction_id
    })
    .increment("count")
    .returning("count");
}

async function updateCount(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number,
  count: number
) {
  await db("Smash")
    .where({
      game_id,
      round_id,
      definition_id,
      reaction_id
    })
    .update({ count })
    .returning("count");
}

async function bulkUpdate(arr: any[], cb?: any) {
  try {
    arr.forEach(async (item) => {
      const { game_id, round_id, definition_id, reaction_id, value } = item;
      const result = await updateCount(game_id, round_id, definition_id, reaction_id, value);
      const check:number = Number(result);
      if (check === NaN || check <= 0) {
        await add(game_id, round_id, definition_id, reaction_id, value);
      }
    });
  } catch (err) {
    console.log(err);
  }
  return await cb(arr);
}
