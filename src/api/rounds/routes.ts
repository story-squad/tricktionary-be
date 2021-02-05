import { Router } from "express";
import Rounds from "./model";

const router = Router();

router.post("/start", async (req, res) => {
  const { lobby, wordId, lobbyCode } = req.body;
  const result = await Rounds.add(lobby, wordId, lobbyCode);
  res.status(201).json({ roundId: Array.from(result).pop() });
});

router.post("/finish", async (req, res) => {
  const { roundId } = req.body;
  try {
    const result: any = await Rounds.roundFinished(Number(roundId));
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

router.get("/id/:id", async (req, res) => {
  const round_id = Number(req.params.id);
  let round;
  if (!round_id) {
    res.status(400).json({ error: "id?" });
  }
  try {
    round = await Rounds.get(round_id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ round });
});
export default router;
