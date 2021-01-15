import { Router } from "express";
import Rounds from "./model";

const router = Router();

router.post("/start", async (req, res) => {
  const { lobby, wordId } = req.body;
  if (lobby && wordId) {
    const [roundId] = await Rounds.add(lobby, wordId);
    res.send(201).json({ roundId }); // return ID of new round
  }
});

router.post("/finish", async (req, res) => {
  const {roundId} = req.body;
  const result = await Rounds.roundFinished(Number(roundId))
  res.send(200).json({result})
  console.log(result)
});

export default router;
