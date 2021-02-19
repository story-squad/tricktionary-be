import { Router } from "express";
import Definitions from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerId, definition, roundId } = req.body;
  let result: any;
  let defId: number = -1;
  try {
    result = await Definitions.add(playerId, definition, roundId);
    defId = result.pop();
  } catch (err) {
    console.log("error! definitions router");
  }
  if (defId > -1) {
    res.status(201).json({ definitionId: defId });
  } else {
    res.status(400).json({ error: "failed to get definition Id" });
  }
});

router.get("/user/:uid/round/:rid", async (req, res) => {
  const user_id = req.params.uid;
  const round_id = Number(req.params.rid);
  let definition;
  try {
    definition = await Definitions.byUserInRound(user_id, round_id);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  res.status(200).json({
    user_id,
    round_id,
    definition
  });
});

export default router;
