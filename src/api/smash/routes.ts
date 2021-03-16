import { Router } from "express";
import { log } from "../../logger";
import { redisCache, TricktionaryCache } from "../middleware";
import smashUpdate from "./util";
import { bulkUpdate } from "./model";

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
  const simpleCallback = async (value: any) => res.json(value);
  // create a callback to return the result
  const keyName = `${game_id}-${roundId}-${definitionId}-${reactionId}`;
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

router.post("/totals", redisCache, async (req: any, res: any) => {
  const tc: TricktionaryCache = req.redis;
  const { game_id, round_id } = req.body;
  // search key-names from the cache that match this pattern,
  const pattern = `${game_id}-${round_id}*`;
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
    const reaction_id = Number(parseKey.pop());
    const definition_id = Number(parseKey.pop());
    const round_id = Number(parseKey.pop());
    const game_id = parseKey.join("-");
    // add result to queue
    result.queue.push({ game_id, round_id, definition_id, reaction_id, value });
    if (result.queue.length === total) {
      // this is the last item. 
      // call bulkUpdate with the entire collection.
      await bulkUpdate(result.queue, async (value: any) => res.json(value));
    }
  }
  const tcCallback = tc?.createCallback(pattern, async (keys: any) => {
    const totalKeys = keys.length;
    keys.forEach((keyName: string) =>
      tc.getValue(
        keyName,
        tc?.createCallback(keyName, (value: any) =>
          updateFinal(keyName, value, totalKeys)
        )
      )
    );
  });
  try {
    await tc?.findKeys(pattern, tcCallback);
  } catch (err) {
    res.json({ error: err });
  }
});

export default router;
