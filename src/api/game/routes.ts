import { Router } from "express";
import Game from "./model";
import { errorMessage } from "../../errorMessage";

const router = Router();

router.post("/new", async (req, res) => {
  const { og_host } = req.body;
  let game_id;
  try {
    if (og_host) {
      game_id = await Game.add(og_host);
    }
  } catch (err) {
    res.status(400).json({ message: errorMessage(err) });
  }
  res.status(200).json(game_id);
});

router.get("/all", async (req, res) => {
  let result;
  try {
    result = await Game.get();
  } catch (err) {
    result = { error: errorMessage(err) };
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
    return res.status(400).json({ error: errorMessage(err) });
  }
  return res.status(200).json(result);
});

router.get("/leaderboard/:game_id", async (req, res) => {
  let game_id:string = req.params.game_id;
  let result: any;
  // aggregates data from 5 tables
  try {
    result = await Game.leaderBoard(game_id);
  } catch (err) {
    return res.status(400).json({ error: errorMessage(err) });
  }
  return res.status(200).json(result);
})

export default router;
