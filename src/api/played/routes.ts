import { Router } from "express";
import { getGames, getPlayers, played } from "./model";
const router = Router();

router.post("/new", async (req, res) => {
  const { player_id, game_id } = req.body;
  console.log("NEW PLAYED RECORD.")
  if (!(player_id && game_id)) {
    res.status(400).json({message: "missing information"})
  }
  const linkedPlayer = await played(player_id, game_id);
  if (!linkedPlayer.ok) {
    res.status(400).json({message: linkedPlayer.message})
  }
  res.status(200).json({played: linkedPlayer.played})
});

router.get("/player/:id", async (req, res) => {
  const player_id = req.params.id;
  if (!player_id) {
    res.status(400).json({ error: "id ?" });
  }
  let result;
  try {
    result = getGames(player_id); // return this player's games.
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result)
});

router.get("/games/:id", async (req, res) => {
  const game_id = req.params.id;
  if (!game_id) {
    res.status(400).json({ error: "id ?" });
  }
  let result;
  try {
    result = getPlayers(game_id); // return this player's games.
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result)
});

export default router;
