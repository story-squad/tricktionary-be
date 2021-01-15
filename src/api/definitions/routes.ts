import { Router } from "express";
import Definitions from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerID, definition, roundId } = req.body
  const [ defId, ...msg ]  = await Definitions.add(playerID, definition, roundId);
  if (defId > -1) {
    res.send(201).json({definitionId: defId})
  } else {
    res.send(400).json({ error: msg })
  }
});

export default router;
