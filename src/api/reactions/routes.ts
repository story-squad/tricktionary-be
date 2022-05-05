import { Router } from "express";
import { redisCache, TricktionaryCache } from "../middleware";
import { getDatabaseReactions } from "./util";

import { log } from "../../logger";

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

router.get("/", redisCache, async (req: any, res: any, next: any) => {
  const cache: TricktionaryCache = req.redis;
  // no redis ?
  if (!cache?.getValue) {
    // not connected to redis
    try {
      await sendFromDatabase(req, res);
    } catch (err: any) {
      return res
        .status(400)
        .json({ error: err.message || "database lookup error" });
    }
  } else {
    // with redis
    try {
      await cache.getValue(
        "tricktionary-reactions",
        async function (err: any, value: any) {
          if (value && !err) {
            return res.json(JSON.parse(value));
          } else {
            log(
              "tricktionary-reactions were not found in the cache => sendFromDatabase"
            );
            // database
            await sendFromDatabase(req, res);
          }
        }
      );
    } catch (err: any) {
      log(err?.message || err);
      next();
    }
  }
});

export default router;
