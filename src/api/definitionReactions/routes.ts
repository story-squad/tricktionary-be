import { Router } from "express";
import DefinitionReactions from "./model";
import { validateDefinitionReaction } from "./utils";

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
router.post("/", async (req: any, res: any) => {
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
router.get("/", (req: any, res: any) => {
  res.status(200).json({ router: "definition-reactions" });
});

router.get("/user/:id", (req: any, res: any) => {
  const userID = req.params.id;
  return DefinitionReactions.getByUser(userID);
});

router.get("/round/:id", (req: any, res: any) => {
  const roundID = Number(req.params.id);
  return DefinitionReactions.getByRound(roundID);
});

router.get("/reaction/:id", (req: any, res: any) => {
  const reactionID = Number(req.params.id);
  return DefinitionReactions.getByReaction(reactionID);
});

router.get("/definition/:id", (req: any, res: any) => {
  const definitionID = Number(req.params.id);
  return DefinitionReactions.getByDefinition(definitionID);
});

router.get("/finished", (req: any, res: any) => {
  return DefinitionReactions.getFinished();
});

router.get("/unfinished", (req: any, res: any) => {
  return DefinitionReactions.getUnfinished();
});

export default router;
