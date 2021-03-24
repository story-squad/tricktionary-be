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
    res.json({ message: "missing information" });
  }
  try {
    const linkedPlayer = await scoreCard(player_id, game_id);
    if (!linkedPlayer.ok) {
      res.json({ message: linkedPlayer.message });
    }
    res.json({ score: linkedPlayer.id });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/player/:id", async (req, res) => {
  const player_id = req.params.id;
  if (!player_id) {
    res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getGames(player_id); // return this player's games.
  } catch (err) {
    res.json({ error: err.message });
  }
  res.json(result);
});

router.get("/player/:pid/game/:gid", async (req, res) => {
  const player_id = req.params.pid;
  const game_id = req.params.gid;
  if (!player_id || !game_id) {
    res.json({ error: "id ?" });
  }
  let result;
  try {
    result = await getPlayerScore(player_id, game_id);
  } catch (err) {
    res.json({ error: err.message });
  }
  res.json(result);
});

router.get("/games/:id", async (req, res) => {
  const game_id = req.params.id;
  if (!game_id) {
    res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getPlayers(game_id); // return this game's players.
  } catch (err) {
    res.json({ error: err.message });
  }
  res.json(result);
});

router.put("/increase/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!player_id || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
    res.json({ error: errorMessage });
  }
  try {
    console.log("adding points...");
    const result = await addPoints(player_id, game_id, points);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
});
router.put("/decrease/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!player_id || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
    res.json({ error: errorMessage });
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
    let errorMessage = `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`;
    res.json({ error: errorMessage });
  }
  let result;
  if (!top_definition_id) {
    console.log("GETTING SCORE");
    result = await getPlayerScore(player_id, game_id);
    console.log(result);
    res.json({ score: result.score });
  }
  console.log(req.body);
  try {
    result = await updateDefinition(
      player_id,
      game_id,
      Number(top_definition_id)
    );
    const { score } = result;
    if (result.ok) {
      console.log(`score: ${score}`);
    } else {
      console.log("error updating score with top definition.");
      res.json(result);
    }
    res.json(score);
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
