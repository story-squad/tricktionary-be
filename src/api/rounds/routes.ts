import { Router } from "express";
import Rounds from "./model";

const router = Router();

router.post("/start", async (req, res) => {
  const { lobby, wordId } = req.body;
  const result = await Rounds.add(lobby, wordId);
  res.status(201).json({ roundId: Array.from(result).pop() });
});

router.post("/finish", async (req, res) => {
  const { roundId } = req.body;
  const result = await Rounds.roundFinished(Number(roundId));
  res.send(200).json({ result });
  console.log(result);
});

export default router;
