import { Router } from "express";
import Votes from "./model";

const router = Router();

router.post("/", async (req, res) => {
  const {userID, definitionID, roundID} = req.body;
  const result = await Votes.add(userID, definitionID, roundID)
  // do some typechecking here.
  res.status(200).json({ ok: true });
});

export default router;
