import { Router } from "express";
import Game from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { og_host } = req.body;
  let game_id;
  try {
    if (og_host) {
      game_id = await Game.add(og_host);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  res.status(200).json(game_id);
});

export default router;