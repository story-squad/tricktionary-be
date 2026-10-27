import { Router } from "express";
import { log } from "../../logger";
import { addReaction, getTotals } from "./model";
import { errorMessage } from "../../errorMessage";

const router = Router();

/**
 * PUT /api/smash/emoji/:lobbyCode: count one reaction to a definition in the
 * Smash table and reply { value } with the new total. Replies exactly once.
 */
export async function smashEmoji(req: any, res: any) {
  const lobbyCode = req.params.lobbyCode;
  const game_id = req.body.game_id;
  // deconstruct required fields
  const { roundId, definitionId, reactionId } = req.body;
  if (!lobbyCode || !game_id) {
    const details = `lobbyCode ${lobbyCode}, game_id ${game_id}`;
    log(`[SMASH!] error: ${details}`);
    return res.json({ error: details });
  }
  try {
    const value = await addReaction(game_id, roundId, definitionId, reactionId);
    return res.status(200).json({ value });
  } catch (err) {
    log(`[SMASH!] error: ${errorMessage(err)}`);
    return res.status(400).json({ error: errorMessage(err) });
  }
}

/**
 * GET /api/smash/totals/:game_id/:round_id: the round's reaction totals, from
 * the Smash table. Replies exactly once.
 */
export async function smashTotals(req: any, res: any) {
  const game_id: string = req.params.game_id;
  const round_id: number = req.params.round_id;
  try {
    const totals = await getTotals(game_id, round_id);
    return res.status(200).json(totals);
  } catch (err) {
    return res.status(400).json({ error: errorMessage(err) });
  }
}

router.put("/emoji/:lobbyCode", smashEmoji);
router.get("/totals/:game_id/:round_id", smashTotals);

export default router;
