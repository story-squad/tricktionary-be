import Player from "./model";
import { log } from "../../logger";
import { Router } from "express";

const router = Router();

router.get("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  let player;
  try {
    player = await Player.getPlayer(player_id);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/name/:id", async (req, res) => {
  const player_id = req.params.id;
  let result;
  try {
    result = await Player.getName(player_id);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json(result);
});

router.get("/last-user-id/:id", async (req, res) => {
  const user_id = req.params.id;
  log(`called /api/Player/last-user-id/${user_id}`);
  let player;
  try {
    player = await Player.bySocketID(user_id);
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  return res.status(200).json({ ok: true, player });
});

router.put("/id/:id", async (req, res) => {
  const player_id = req.params.id;
  const changes = req.body;
  let player;
  try {
    player = await Player.updatePlayer(player_id, changes);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ player });
});

router.get("/namecheck/:username/:lobbycode", async (req, res) => {
  const name = req.params.username;
  const last_played = req.params.lobbycode;
  const lc_limit: number = process.env.LC_LENGTH
    ? Number(process.env.LC_LENGTH)
    : 4;
  if (!name || !last_played) {
    return res.status(400).json({
      error: `required: username ${name?.length > 0}, lobbycode ${
        last_played?.length === lc_limit
      }`,
    });
  }
  return res.status(200).json(await Player.nameCheck(name, last_played));
});

export default router;
