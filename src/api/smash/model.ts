import db from "../../dbConfig";
// import { log } from "../../logger";
const cacheGroupName = "SMASHED";

export { add, get, incr, updateCount, bulkUpdate, cacheGroupName, getTotals };

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
    .returning("count").first();
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
    .first()
    .update({ count })
    .returning("count").first();
}

/**
 * update these records in the RDB where necessary,
 *
 * @param arr array of Smash records
 * @param cb callback function
 * @returns the list of records, unmodified
 */
async function bulkUpdate(arr: any[], cb?: any) {
  try {
    arr.forEach(async (item) => {
      const { game_id, round_id, definition_id, reaction_id, value } = item;
      // check the database for an existing record
      const result = await db("Smash")
        .where({
          game_id,
          round_id,
          definition_id,
          reaction_id
        })
        .first();
      if (!(result?.id && result?.count)) {
        await add(game_id, round_id, definition_id, reaction_id, value);
      } else {
        if (value > result?.count) {
          await db("Smash").where({ id: result.id }).update({ count: value });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
  return await cb(arr);
}

async function getTotals(game_id: string, round_id: number) {
  return await db("Smash").where({
    game_id,
    round_id
  });
}
