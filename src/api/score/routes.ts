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
  const { playerId, game_id } = req.body;
  log("NEW SCORE CARD.");
  if (!(playerId && game_id)) {
    return res.json({ message: "missing information" });
  }
  try {
    const linkedPlayer = await scoreCard(playerId, game_id);
    if (!linkedPlayer.ok) {
      return res.json({ message: linkedPlayer.message });
    }
    return res.json({ score: linkedPlayer.id });
  } catch (err:any) {
    if (err instanceof Error) return res.json({ message: err.message });
  }
});

router.get("/player/:id", async (req, res) => {
  const playerId = req.params.id;
  if (!playerId) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getGames(playerId); // return this player's games.
  } catch (err:any) {
    if (err instanceof Error) return res.json({ error: err.message });
  }
  return res.json(result);
});

router.get("/player/:pid/game/:gid", async (req, res) => {
  const playerId = req.params.pid;
  const gameId = req.params.gid;
  if (!playerId || !gameId) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = await getPlayerScore(playerId, gameId);
  } catch (err:any) {
    if (err instanceof Error) return res.json({ error: err.message });
  }
  return res.json(result);
});

router.get("/games/:id", async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    return res.json({ error: "id ?" });
  }
  let result;
  try {
    result = getPlayers(gameId); // return this game's players.
  } catch (err:any) {
    if (err instanceof Error) return res.json({ error: err.message });
  }
  return res.json(result);
});

router.put("/increase/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!playerId || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${playerId}]`;
    return res.json({ error: errorMessage });
  }
  try {
    const result = await addPoints(playerId, game_id, points);
    return res.json(result);
  } catch (err:any) {
    if (err instanceof Error) return res.json({ error: err.message });
  }
});
router.put("/decrease/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const { game_id, points } = req.body;
  let errorMessage: string | undefined;
  if (!playerId || !game_id || !points) {
    errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${playerId}]`;
    return res.json({ error: errorMessage });
  }
  try {
    const result = await subPoints(playerId, game_id, points);
    return res.json(result);
  } catch (err:any) {
    if (err instanceof Error) return res.json({ error: err.message });
  }
});

router.put("/def/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const { game_id, top_definition_id } = req.body;
  if (!playerId || !game_id || !top_definition_id) {
    const errorMessage = `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${playerId}]`;
    return res.status(400).json({ error: errorMessage });
  }
  let result:any;
  if (!top_definition_id) {
    result = await getPlayerScore(playerId, game_id);
    return res.status(200).json({ score: result.score });
  }
  try {
    result = await updateDefinition(
      playerId,
      game_id,
      Number(top_definition_id)
    );
    const { score }: any = result;
    if (result) {
      if (!result.ok) {
        res.json(result);}
    }
    return res.json(score);
  } catch (err:any) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/latest/:game_id", async (req, res) => {
  const game_id: string = req.params.game_id;
  if (!game_id) {
    return res.json({ ok: false });
  }
  // this route creates the leaderboard, during gameplay
  let leaderboard;
  try {
    leaderboard = await getLatest(game_id);
  } catch (err:any) {
    return res.json({ ok: false, error: err });
  }
  if (!leaderboard?.ok) {
    // if not ok, tell us why
    return res.json(leaderboard);
  }
  let latestScore: any = [];
  let countdown = leaderboard.latest.length;
  // update the latest top_definitions, as needed; returning the list
  for (const scoreCard1 of leaderboard.latest) {
    const { playerId, points, top_definition_id } = scoreCard1;
    log(`looking up top definition for player ${playerId}`);
    const checkTop = await findTopDefinition(playerId, game_id); // sort
    const latestTopDef = checkTop.ok && checkTop?.top_definition?.id;
    if (latestTopDef && top_definition_id !== latestTopDef) {
      log("top definition changed... updating score-card"); // update
      await updateDefinition(playerId, game_id, latestTopDef);
      countdown -= 1;
      latestScore = [
        ...latestScore,
        {
          playerId,
          points,
          top_definition_id: latestTopDef,
        },
      ];
    } else {
      log(`top definition remains to be ${top_definition_id}`);
      countdown -= 1;
      latestScore = [...latestScore, { playerId, points, top_definition_id }];
    }
    if (countdown < 1) {
      res.json(await latestScore);
    }
  }
});

export default router;
