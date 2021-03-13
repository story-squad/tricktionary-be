import { Router } from "express";
import Definitions from "./model";
import { DefinitionType } from "./utils";
import { log } from "../../logger";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerId, definition, roundId } = req.body;
  let result: any;
  let defId: number = -1;
  try {
    result = await Definitions.add(playerId, definition, roundId);
    defId = result.pop();
  } catch (err) {
    log("error! definitions router");
    log(err.message);
  }
  if (defId > -1) {
    res.status(201).json({ definitionId: defId });
  } else {
    res.status(400).json({ error: "failed to get definition Id" });
  }
});

/**
 * @returns { user_id, round_id, definition }
 */
router.get("/user/:uid/round/:rid", async (req, res) => {
  const user_id = req.params.uid;
  const round_id = Number(req.params.rid);
  let definition: DefinitionType;
  try {
    // player's definition this round
    definition = await Definitions.byUserInRound(user_id, round_id);
  } catch (err) {
    // a blank definition object
    definition = {
      user_id,
      round_id,
      definition: ""
    };
  }
  res.status(200).json({
    user_id,
    round_id,
    definition
  });
});

export default router;
