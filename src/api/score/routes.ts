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
  getLatest,
  updateDefinition,
  findTopDefinition,
} from "./model";
const router = Router();

router.post("/new", async (req, res) => {
  const { player_id, game_id } = req.body;
  log("NEW SCORE CARD.");
  if (!(player_id && game_id)) {
    return res.json({ message: "missing information" });
  }
  try {
    const linkedPlayer = await scoreCard(player_id, game_id);
    if (!linkedPlayer.ok) {
      return res.json({ message: linkedPlayer.message });
    }
    return res.json({ score: linkedPlayer.id });
  } catch (err) {
    return res.json({ message: err.message });
  }
});

router.get("/player/:id", async (req, res) => {
  const player_id = req.params.id;
  if (!player_id) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getGames(player_id); // return this player's games.
  } catch (err) {
    return res.json({ error: err.message });
  }
  return res.json(result);
});

router.get("/player/:pid/game/:gid", async (req, res) => {
  const player_id = req.params.pid;
  const game_id = req.params.gid;
  if (!player_id || !game_id) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = await getPlayerScore(player_id, game_id);
  } catch (err) {
    return res.json({ error: err.message });
  }
  return res.json(result);
});

router.get("/games/:id", async (req, res) => {
  const game_id = req.params.id;
  if (!game_id) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getPlayers(game_id); // return this game's players.
  } catch (err) {
    return res.json({ error: err.message });
  }
  return res.json(result);
});

router.put("/increase/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!player_id || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
    return res.json({ error: errorMessage });
  }
  try {
    const result = await addPoints(player_id, game_id, points);
    return res.json(result);
  } catch (err) {
    return res.json({ error: err.message });
  }
});
router.put("/decrease/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!player_id || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
    return res.json({ error: errorMessage });
  }
  try {
    const result = await subPoints(player_id, game_id, points);
    return res.json(result);
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.put("/def/:player_id", async (req, res) => {
  const player_id = req.params.player_id;
  const { game_id, top_definition_id } = req.body;
  if (!player_id || !game_id || !top_definition_id) {
    let errorMessage = `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`;
    return res.status(400).json({ error: errorMessage });
  }
  let result;
  if (!top_definition_id) {
    result = await getPlayerScore(player_id, game_id);
    return res.status(200).json({ score: result.score });
  }
  try {
    result = await updateDefinition(
      player_id,
      game_id,
      Number(top_definition_id)
    );
    const { score } = result;
    if (result.ok) {
    } else {
      res.json(result);
    }
    return res.json(score);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/latest/:game_id", async (req, res) => {
  const game_id: string = req.params.game_id;
  if (!game_id) {
    return res.json({ ok: false });
  }
  let leaderboard;
  try {
    leaderboard = await getLatest(game_id);
  } catch (err) {
    return res.json({ ok: false, error: err });
  }
  if (!leaderboard?.ok) {
    // if not ok, tell us why
    return res.json(leaderboard);
  }
  const latestScore: any = [];
  let countdown = leaderboard.latest.length;
  // update the latest top_definitions, as needed; returning the list
  leaderboard.latest.forEach(async (scoreCard: any) => {
    const { player_id, points, top_definition_id } = scoreCard;
    log(`looking up top definition for player ${player_id}`);
    const checkTop = await findTopDefinition(player_id, game_id);
    const latest_top_def = checkTop.ok && checkTop?.top_definition?.id;
    if (latest_top_def && top_definition_id !== latest_top_def) {
      log("top definition changed... updating score-card");
      await updateDefinition(player_id, game_id, latest_top_def);
      countdown -= 1;
      latestScore.push({
        player_id,
        points,
        top_definition_id: latest_top_def,
      });
    } else {
      log(`top definition remains to be ${top_definition_id}`);
      countdown -= 1;
      latestScore.push({ player_id, points, top_definition_id });
    }
    if (countdown < 1) {
      return res.json(latestScore);
    }
  });
});

export default router;
