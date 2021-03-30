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

router.get("/all", async (req, res) => {
  let result;
  try {
    result = await Game.get();
  } catch (err) {
    result = { error: err.message };
  }
  return res.status(200).json(result.games);
});

router.get("/latest/:limit", async (req, res) => {
  let limit:string = req.params.limit;
  const n = Number(limit) > 0 ? Number(limit) : 5;
  let result: any;
  try {
    result = await Game.latest(n);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(200).json(result);
});

export default router;
