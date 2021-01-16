import { Router } from "express";
import Definitions from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerId, definition, roundId } = req.body
  let result:any;
  let defId:number = -1;
  try {
    result = await Definitions.add(playerId, definition, roundId);
    defId = result.pop();
  } catch (err) {
    console.log('error! definitions router')
  }
  if (defId > -1) {
    res.status(201).json({definitionId: defId});
  } else {
    res.status(400).json({ error: "failed to get definition Id" })
  }
});

export default router;
