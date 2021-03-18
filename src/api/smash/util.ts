// import { log } from "../../logger";
import { TricktionaryCache } from "../middleware";
import { incr, add, cacheGroupName } from "./model";
import { log } from "../../logger";

/**
 * Returns true when all numbers are greater than zero
 * @param arr Array of numbers
 * @returns boolean
 */
function gtZero(arr: number[]): boolean {
  return arr.map((n) => n > 0).reduce((a, b) => (b === a) === true);
}

async function pgUpdate(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number,
  callBack?: any
) {
  log(`PG: ${game_id}, ${round_id}, ${definition_id}, ${reaction_id}`);
  try {
    // when all foreign-key IDs are > 0 they are likely to be valid.
    if (gtZero([round_id, definition_id, reaction_id])) {
      // try to increment this record.count
      let value = await incr(game_id, round_id, definition_id, reaction_id);
      let n = Number(value);
      if (n === NaN || n <= 0) {
        value = await add(game_id, round_id, definition_id, reaction_id);
      }
      return await callBack({ value });
    } else {
      // are those valid foreign keys?
      return { error: "check ids" };
    }
  } catch (err) {
    // database error ?
    return { error: err };
  }
}

/**
 * https://redis.io/commands/incr
 * @returns Promise<number>
 */
export async function smashUpdate(
  mem: TricktionaryCache,
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number,
  callBack?: any,
  last?: number
) {
  // create a unique string keyname
  const keyName = `${cacheGroupName}${game_id}-${round_id}-${definition_id}-${reaction_id}`;
  console.log(keyName);
  // no TricktionaryCache ?
  if (!mem?.incValue) {
    log("no cache update");
    try {
      // update the postgres database
      return await pgUpdate(
        game_id,
        round_id,
        definition_id,
        reaction_id,
        callBack
      );
      // const value = await pgUpdate(keyName);
      // return await callBack(value);
    } catch (err) {
      log(err);
      return;
    }
  }
  // TricktionaryCache ?
  const defaultValue = last || 0;
  try {
    // cache update
    return await mem?.incValue(keyName, callBack);
  } catch (err) {
    return await callBack(defaultValue + 1);
  }
}

export default smashUpdate;
