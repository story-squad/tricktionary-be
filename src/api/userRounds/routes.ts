import { Router } from "express";
import userRounds from "./model";

const router = Router();

router.post("/add-players", async (req, res) => {
  // this route is called internally by sockets/handleStartGame
  const { players, roundId } = req.body;
  if (!(players && roundId)) res.status(400).json({message: "missing required information"})
  const result = await userRounds.addAllUserRounds(players, Number(roundId));
  res.status(result.ok ? 201 : 400).json({ message: result.message });
});

export default router;
