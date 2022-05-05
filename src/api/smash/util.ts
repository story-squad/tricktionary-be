// import { log } from "../../logger";
import { TricktionaryCache } from "../middleware";
import { incr, add, get, cacheGroupName } from "./model";
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
  let result: any;
  let value: number = 0;
  log(`PG: ${game_id}, ${round_id}, ${definition_id}, ${reaction_id}`);
  const oldValue = await get(game_id, round_id, definition_id, reaction_id);
  if (!oldValue?.id) {
    try {
      // add
      result = await add(game_id, round_id, definition_id, reaction_id);
      value = result[0] || 0;
    } catch (err: any) {
      return { error: err };
    }
  } else {
    try {
      // increment
      result = await incr(game_id, round_id, definition_id, reaction_id);
      value = result[0] || result;
    } catch (err: any) {
      // database error ?
      return { error: err };
    }
  }
  return await callBack(value);
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
    } catch (err: any) {
      log(err);
      return;
    }
  }
  // TricktionaryCache ?
  const defaultValue = last || 0;
  try {
    // cache update
    return await mem?.incValue(keyName, callBack);
  } catch (err: any) {
    return await callBack(defaultValue + 1);
  }
}

export default smashUpdate;
