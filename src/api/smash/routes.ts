import { Router } from "express";
import { log } from "../../logger";
import { redisCache, TricktionaryCache } from "../middleware";
import smashUpdate from "./util";
import { bulkUpdate, cacheGroupName, getTotals } from "./model";

const router = Router();

router.put("/emoji/:lobbyCode", redisCache, async (req: any, res: any) => {
  const tc: TricktionaryCache = req.redis;
  const lobbyCode = req.params.lobbyCode;
  const game_id = req.body.game_id;
  // deconstruct required fields
  const { roundId, definitionId, reactionId, value } = req.body;
  if (!lobbyCode || !game_id) {
    const details = `lobbyCode ${lobbyCode}, game_id ${game_id}`;
    log(`[SMASH!] error: ${details}`);
    return await res.json({ error: details });
  }
  // initialize last value
  const last = value || 0;
  // non-cache callback for postgres;
  const simpleCallback = async (value: any) => res.json({ value });
  // create a callback to return the result
  const keyName = `${cacheGroupName}${game_id}-${roundId}-${definitionId}-${reactionId}`;
  const tcCallback =
    tc?.createCallback(keyName, async (value: any) => res.json({ value })) ||
    simpleCallback;
  // call asynchronous update function
  return await smashUpdate(
    tc,
    game_id,
    roundId,
    definitionId,
    reactionId,
    tcCallback,
    last
  );
});

router.get(
  "/totals/:game_id/:round_id",
  redisCache,
  async (req: any, res: any) => {
    const tc: TricktionaryCache = req.redis;
    const game_id: string = req.params.game_id;
    const round_id: number = req.params.round_id;
    if (!tc) {
      // return the results from the RDB
      try {
        const totals = await getTotals(game_id, round_id);
        return await res.status(200).json(totals);
      } catch (err:any) {
        return await res.status(400).json({ error: err.message });
      }
    }
    // const { game_id, round_id } = req.body;
    // search key-names from the cache that match this pattern,
    const pattern = `${cacheGroupName}${game_id}-${round_id}*`;
    type resultQueue = {
      [key: string]: any[];
    };
    // collect them in this queue
    const result: resultQueue = { queue: [] };
    async function updateFinal(keyName: string, value: any, total: number) {
      const check = Number(value);
      if (check === NaN || check <= 0) {
        log("[ERROR] non-numeric value");
      }
      let parseKey = keyName.split("-");
      const reaction_id = Number(parseKey.pop()); // thats numberwang
      const definition_id = Number(parseKey.pop()); // thats numberwang
      const round_id = Number(parseKey.pop()); // thats numberwang
      const game_id = parseKey.join("-").slice(cacheGroupName.length);
      result.queue.push({
        game_id,
        round_id,
        definition_id,
        reaction_id,
        value,
      });
      if (result.queue.length === total) {
        // lets rotate the board!
        await bulkUpdate(result.queue, async (value: any) => res.json(value));
      }
    }
    const tcCallback = tc?.createCallback(pattern, async (keys: any) => {
      const totalKeys = keys.length;
      keys.forEach((keyName: string) =>
        tc.getValue(
          keyName,
          tc?.createCallback(keyName, (value: any) =>
            updateFinal(keyName, Number(value), totalKeys)
          )
        )
      );
    });
    try {
      await tc?.findKeys(pattern, tcCallback);
    } catch (err:any) {
      res.json({ error: err });
    }
  }
);

export default router;
