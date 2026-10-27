import { Router } from "express";
import { redisCache, TricktionaryCache } from "../middleware";
import { getDatabaseReactions } from "./util";

import { log } from "../../logger";
import { errorMessage } from "../../errorMessage";

const router = Router();

/**
 * request all from the database table "Reactions"
 * @param req Request object
 * @param res Resonse object
 * @returns
 */
async function sendFromDatabase(req: any, res: any) {
  const reply = await getDatabaseReactions(req.redis);
  return res.json(reply);
}

const CACHE_KEY = "tricktionary-reactions";

/**
 * Read the cached reactions. Resolves with the parsed value, or undefined when
 * the cache has none, the lookup fails, or the value is not JSON. Never
 * rejects, so the caller can fall back to the database.
 *
 * @param cache the Tricktionary cache
 */
function readCachedReactions(cache: TricktionaryCache): Promise<unknown> {
  return new Promise((resolve) => {
    try {
      cache.getValue(CACHE_KEY, (err: unknown, value: unknown) => {
        if (err) {
          log(`[cache] ${CACHE_KEY} lookup failed: ${errorMessage(err)}`);
          return resolve(undefined);
        }
        if (!value) return resolve(undefined);
        try {
          resolve(JSON.parse(String(value)));
        } catch (parseErr) {
          log(`[cache] ${CACHE_KEY} is not JSON: ${errorMessage(parseErr)}`);
          resolve(undefined);
        }
      });
    } catch (err) {
      log(`[cache] ${CACHE_KEY} lookup failed: ${errorMessage(err)}`);
      resolve(undefined);
    }
  });
}

/**
 * GET /api/reactions: the cached reactions when Redis has them, otherwise the
 * database's. Replies exactly once.
 */
export async function sendReactions(req: any, res: any) {
  const cache: TricktionaryCache = req.redis;
  if (cache?.getValue) {
    const cached = await readCachedReactions(cache);
    if (cached !== undefined) return res.json(cached);
    log(
      "tricktionary-reactions were not found in the cache => sendFromDatabase"
    );
  }
  try {
    await sendFromDatabase(req, res);
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorMessage(err) || "database lookup error" });
  }
}

router.get("/", redisCache, sendReactions);

export default router;
