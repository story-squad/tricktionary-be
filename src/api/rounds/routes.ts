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
  try {
    const result:any = await Rounds.roundFinished(Number(roundId));
    res.status(200).json({ result });
  } catch (err) {
    console.log(err)
    res.status(400).json({ err })
  }
});

export default router;
