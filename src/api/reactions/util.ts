import Reactions from "./model";
import { log } from "../../logger";
import { TricktionaryCache } from "../middleware";
/**
 * seconds to live in redis cache
 */
const CACHE_LIFETIME_REACTIONS: number = process.env.CACHE_LIFETIME_REACTIONS
  ? Number(process.env.CACHE_LIFETIME_REACTIONS)
  : 120;

/**
 * DB table of Reactions
 * @returns Promise
 */
export async function getDatabaseReactions(cache: TricktionaryCache) {
  try {
    // lookup in rdb
    const available = await Reactions.getAll();
    // update cache when available
    if (cache?.setValue) {
      const stringData = JSON.stringify({ available });
      cache.setValue(
        "tricktionary-reactions",
        stringData,
        CACHE_LIFETIME_REACTIONS
      );
    }
    return { available };
  } catch (err:any) {
    log("error whilst getting/setting tricktionary-reactions");
    return { error: err };
  }
}
