import { Response, Router } from "express";
import DefinitionReactions from "./model";
import { validateDefinitionReaction } from "./utils";
import { errorMessage } from "../../errorMessage";

const router = Router();

/**
 * example req.body
 *
 * {
 *  user_id: 1,
 *  round_id: 1,
 *  reaction_id: 1,
 *  definition_id: 1,
 *  game_finished: false
 * }
 *
 */
router.post("/", async (req, res) => {
  const result = validateDefinitionReaction(req.body);
  if (result.ok) {
    // deconstruct KWARGS
    const {
      user_id,
      round_id,
      reaction_id,
      definition_id,
      game_finished
    } = result.value;
    // send as ordinal ARGS
    const drId = await DefinitionReactions.add(
      user_id,
      round_id,
      reaction_id,
      definition_id,
      game_finished
    );
    res.status(201).json({ added: true, drId });
  } else {
    res.status(400).json({ message: result.message });
  }
});
router.get("/", (req, res) => {
  res.status(200).json({ router: "definition-reactions" });
});

/**
 * Reply with the rows a lookup returns (200), or its error (400). The model
 * functions return knex queries, which run only when awaited.
 */
async function replyWithRows(res: Response, lookup: () => PromiseLike<unknown>) {
  let rows: unknown;
  try {
    rows = await lookup();
  } catch (err) {
    return res.status(400).json({ error: errorMessage(err) });
  }
  return res.status(200).json(rows);
}

router.get("/user/:id", (req, res) => {
  const userID = req.params.id;
  return replyWithRows(res, () => DefinitionReactions.getByUser(userID));
});

router.get("/round/:id", (req, res) => {
  const roundID = Number(req.params.id);
  return replyWithRows(res, () => DefinitionReactions.getByRound(roundID));
});

router.get("/reaction/:id", (req, res) => {
  const reactionID = Number(req.params.id);
  return replyWithRows(res, () => DefinitionReactions.getByReaction(reactionID));
});

router.get("/definition/:id", (req, res) => {
  const definitionID = Number(req.params.id);
  return replyWithRows(res, () =>
    DefinitionReactions.getByDefinition(definitionID)
  );
});

router.get("/finished", (req, res) => {
  return replyWithRows(res, () => DefinitionReactions.getFinished());
});

router.get("/unfinished", (req, res) => {
  return replyWithRows(res, () => DefinitionReactions.getUnfinished());
});

export default router;
