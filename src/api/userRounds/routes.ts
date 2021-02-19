import { Router } from "express";
import userRounds from "./model";

const router = Router();
router.post("/add-players", async (req, res) => {
  // this route is called internally by sockets/handleStartGame
  const { players, roundId, game_id } = req.body;
  if (!(players && roundId))
    res.status(400).json({ message: "missing required information" });
  const result = await userRounds.addAllUserRounds(players, Number(roundId), game_id);
  res.status(result.ok ? 201 : 400).json({ message: result.message });
});

router.get("/user/:id", async (req, res) => {
  const user_id = req.params.id;
  let possibilities;
  if (!user_id) {
    res.status(400).json({ ok: false, message: "/:id required" });
  }
  try {
    possibilities = await userRounds.findPlayer(user_id);
  } catch (err) {
    res.status(200).json({ ok: false, message: err.message });
  }
  res.status(200).json({ ok: true, possibilities });
});

router.get("/user/:id/last", async (req, res) => {
  const user_id = req.params.id;
  let possibilities;
  if (!user_id) {
    res.status(400).json({ ok: false, message: "/:id required" });
  }
  try {
    possibilities = await userRounds.findLastRound(user_id);
  } catch (err) {
    res.status(200).json({ ok: false, message: err.message });
  }
  res.status(200).json({ ok: true, possibilities });
});

router.get("/user/:id/first", async (req, res) => {
  const user_id = req.params.id;
  let possibilities;
  if (!user_id) {
    res.status(400).json({ ok: false, message: "/:id required" });
  }
  try {
    possibilities = await userRounds.findFirstRound(user_id);
  } catch (err) {
    res.status(200).json({ ok: false, message: err.message });
  }
  res.status(200).json({ ok: true, possibilities });
});

router.get("/user/:uid/game/:gid", async (req, res) => {
  const user_id = req.params.uid;
  const game_id = req.params.gid;
  let thisGame;
  try {
    thisGame = await userRounds.findAll(user_id, game_id);
  } catch (err) {
    res.status(400).json({error: err.message})
  }
  res.status(200).json({ user_rounds: thisGame })
})

export default router;
