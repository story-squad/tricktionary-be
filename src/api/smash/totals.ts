import { log } from "../../logger";
import { cacheGroupName } from "./model";

/** one reaction total read from the cache, ready for bulkUpdate */
export type SmashTotal = {
  game_id: string;
  round_id: number;
  definition_id: number;
  reaction_id: number;
  value: number;
};

/**
 * A reaction total as a positive number, or undefined when the cached value
 * is not one (nonnumeric, zero, or negative).
 *
 * @param value the cached value
 * @returns the count, or undefined if it is invalid
 */
export function validReactionCount(value: unknown): number | undefined {
  const count = Number(value);
  if (Number.isNaN(count) || count <= 0) return undefined;
  return count;
}

/**
 * Split a cache key, `${cacheGroupName}${game_id}-${round_id}-${definition_id}-${reaction_id}`,
 * into its ids. The game id is a uuid and contains dashes of its own.
 *
 * @param keyName cache key
 * @returns the ids in the key
 */
export function parseSmashKey(keyName: string) {
  const parseKey = keyName.split("-");
  const reaction_id = Number(parseKey.pop()); // thats numberwang
  const definition_id = Number(parseKey.pop()); // thats numberwang
  const round_id = Number(parseKey.pop()); // thats numberwang
  const game_id = parseKey.join("-").slice(cacheGroupName.length);
  return { game_id, round_id, definition_id, reaction_id };
}

/**
 * Collect the cached reaction totals of a round. Each of the `total` keys
 * found in the cache is passed to the returned function once, with its value.
 * Keys with an invalid count are logged and left out; once every key has been
 * seen, `onComplete` receives the valid totals.
 *
 * @param total number of cache keys that will be passed in
 * @param onComplete receives the valid totals once all keys are in
 * @returns function(keyName, value) to call for each key
 */
export function createTotalsCollector(
  total: number,
  onComplete: (queue: SmashTotal[]) => unknown
) {
  const queue: SmashTotal[] = [];
  let seen = 0;
  return async function addTotal(keyName: string, value: unknown) {
    seen++;
    const count = validReactionCount(value);
    if (count === undefined) {
      log(`[ERROR] invalid reaction count ${value} for ${keyName}, skipped`);
    } else {
      queue.push({ ...parseSmashKey(keyName), value: count });
    }
    if (seen === total) {
      await onComplete(queue);
    }
  };
}
