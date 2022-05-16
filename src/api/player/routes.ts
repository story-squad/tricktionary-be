import Player from "./model";
import { log } from "../../logger";
import { Router } from "express";

const router = Router();

router.get("/id/:id", async (req, res) => {
  const playerId = req.params.id;
  let player;
  try {
    player = await Player.getPlayer(playerId);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/name/:id", async (req, res) => {
  const playerId = req.params.id;
  let result;
  try {
    result = await Player.getName(playerId);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result);
});

router.get("/last-user-id/:id", async (req, res) => {
  const playerId = req.params.id;
  log(`called /api/Player/last-user-id/${playerId}`);
  let player;
  try {
    player = await Player.bySocketID(playerId);
  } catch (err:any) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  return res.status(200).json({ ok: true, player });
});

router.put("/id/:id", async (req, res) => {
  const playerId = req.params.id;
  const changes = req.body;
  let player;
  try {
    player = await Player.updatePlayer(playerId, changes);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/namecheck/:username/:lobbycode", async (req, res) => {
  const name = req.params.username;
  const lastPlayed = req.params.lobbycode;
  const lcLimit: number = process.env.LC_LENGTH
    ? Number(process.env.LC_LENGTH)
    : 4;
  if (!name || !lastPlayed) {
    return res.status(400).json({
      error: `required: username ${name?.length > 0}, lobbycode ${
        lastPlayed?.length === lcLimit
      }`,
    });
  }
  return res.status(200).json(await Player.nameCheck(name, lastPlayed));
});

export default router;
