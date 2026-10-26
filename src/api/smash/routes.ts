import { Router } from "express";
import { log } from "../../logger";
import { redisCache, TricktionaryCache } from "../middleware";
import smashUpdate from "./util";
import { bulkUpdate, cacheGroupName, getTotals } from "./model";
import { collectCachedTotals } from "./totals";
import { errorMessage } from "../../errorMessage";

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
      } catch (err) {
        return await res.status(400).json({ error: errorMessage(err) });
      }
    }
    // const { game_id, round_id } = req.body;
    // search key-names from the cache that match this pattern,
    const pattern = `${cacheGroupName}${game_id}-${round_id}*`;
    // exactly one reply, whichever way the lookup goes
    const reply = (status: number, body: any) => {
      if (!res.headersSent) res.status(status).json(body);
    };
    try {
      collectCachedTotals(
        tc,
        pattern,
        // lets rotate the board!
        async (queue) => {
          try {
            await bulkUpdate(queue, async (value: any) => reply(200, value));
          } catch (err) {
            reply(400, { error: errorMessage(err) });
          }
        },
        (err) => reply(400, { error: errorMessage(err) })
      );
    } catch (err) {
      reply(400, { error: errorMessage(err) });
    }
  }
);

export default router;
