import Player from "./model";
import { log } from "../../logger";
import { Router } from "express";

const router = Router();

router.get("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  let player;
  try {
    player = await Player.getPlayer(player_id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/last-user-id/:id", async (req, res) => {
  const user_id = req.params.id;
  log(`called /api/Player/last-user-id/${user_id}`);
  let player;
  try {
    player = await Player.bySocketID(user_id);
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  return res.status(200).json({ ok: true, player });
});

router.put("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  const changes = req.body;
  let player;
  try {
    player = await Player.updatePlayer(player_id, changes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});
export default router;
