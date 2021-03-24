import { Router } from "express";
import { log } from "../../logger";
import { redisCache, TricktionaryCache } from "../middleware";
import {
  getGames,
  getPlayers,
  scoreCard,
  addPoints,
  subPoints,
  getPlayerScore,
  updateDefinition,
} from "./model";
const router = Router();

router.post("/new", async (req, res) => {
  const { player_id, game_id } = req.body;
  log("NEW SCORE CARD.");
  if (!(player_id && game_id)) {
    res.status(400).json({ message: "missing information" });
  }
  const linkedPlayer = await scoreCard(player_id, game_id);
  if (!linkedPlayer.ok) {
    res.status(400).json({ message: linkedPlayer.message });
  }
  res.status(200).json({ score: linkedPlayer.id });
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
  res.status(200).json(result);
});

router.get("/player/:pid/game/:gid", async (req, res) => {
  const player_id = req.params.pid;
  const game_id = req.params.gid;
  if (!player_id || !game_id) {
    res.status(400).json({ error: "id ?" });
  }
  let result;
  try {
    result = await getPlayerScore(player_id, game_id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result);
});

router.get("/games/:id", async (req, res) => {
  const game_id = req.params.id;
  if (!game_id) {
    res.status(400).json({ error: "id ?" });
  }
  let result;
  try {
    result = getPlayers(game_id); // return this game's players.
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result);
});

router.put("/increase/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  if (!player_id || !game_id || !points) {
    res.status(200).json({
      error: `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`,
    });
  }
  try {
    const result = await addPoints(player_id, game_id, points);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
});
router.put("/decrease/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  if (!player_id || !game_id || !points) {
    res.status(200).json({
      error: `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`,
    });
  }
  try {
    const result = await subPoints(player_id, game_id, points);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.put("/def/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, top_definition_id } = req.body;
  if (!player_id || !game_id || !top_definition_id) {
    res.status(200).json({
      error: `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`,
    });
  }
  try {
    const score = await updateDefinition(player_id, game_id, top_definition_id);
    res.json(score);
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
