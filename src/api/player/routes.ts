import { newPlayer, updatePlayer, getPlayer, findPlayer } from "./model";

import { Router } from "express";

const router = Router();

router.get("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  let player;
  try {
    player = await getPlayer(player_id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/last-user-id/:id", async (req, res) => {
  const user_id = req.params.id;
  let player;
  try {
    player = await findPlayer("last_user_id", user_id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.put("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  const changes = req.body;
  let player;
  try {
    player = await updatePlayer(player_id, changes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
})
export default router;
