import { Router } from "express";
import Definitions from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerId, definition, roundId } = req.body
  // console.log(`new DEFINITION: ${definition}`)
  // console.log(`playerID: ${playerId}`)
  let defId:any;
  try {
    defId = await Definitions.add(playerId, definition, roundId);
  } catch (err) {
    console.log('error! definitions router')
  }
  // const [ defId, ...msg ]  =
  if (defId) {
    res.send(201).json({definitionId: defId})
  } else {
    res.send(400).json({ error: "failed to get definition Id" })
  }
});

export default router;
