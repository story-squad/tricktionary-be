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
router.post("/", (req, res) => {
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
    DefinitionReactions.add(
      user_id,
      round_id,
      reaction_id,
      definition_id,
      game_finished
    );
    res.status(201).json({ added: true });
  } else {
    res.status(400).json({ message: result.message });
  }
});
router.get("/", (req, res) => {
  res.status(200).json({ router: "definition-reactions" });
});

router.get("/user/:id", (req, res) => {
  const userID = req.params.id;
  return DefinitionReactions.getByUser(userID);
});

router.get("/round/:id", (req, res) => {
  const roundID = Number(req.params.id);
  return DefinitionReactions.getByRound(roundID);
});

router.get("/reaction/:id", (req, res) => {
  const reactionID = Number(req.params.id);
  return DefinitionReactions.getByReaction(reactionID);
});

router.get("/definition/:id", (req, res) => {
  const definitionID = Number(req.params.id);
  return DefinitionReactions.getByDefinition(definitionID);
});

router.get("/finished", (req, res) => {
  return DefinitionReactions.getFinished();
});

router.get("/unfinished", (req, res) => {
  return DefinitionReactions.getUnfinished();
});

export default router;
