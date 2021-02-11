import { Router } from "express";
import { verifyTricktionaryToken } from "./utils";
// import jwt from "jsonwebtoken";
//
// import secrets from "./secrets";
//
import {
  validatePayloadType,
  newToken,
  b64,
  partialRecall,
  totalRecall
} from "./utils";
//
import Player from "../player/model";
const router = Router();

router.get("/find-player/:last_user_id", async (req, res) => {
  const last_user_id = req.params.last_user_id;
  let player;
  let errorMessage = "unknown error";
  if (!last_user_id) {
    res.status(404).json({ message: "last_user_id required" });
  }
  try {
    player = await Player.findPlayer("last_user_id", last_user_id);
  } catch (err) {
    errorMessage = err.message;
    res.status(400).json({ error: errorMessage });
  }
  res.status(200).json(player);
});

router.post("/new-player", async (req, res) => {
  let { last_user_id, jump_code } = req.body;
  if (!last_user_id) {
    res.status(403).json({ message: "last_user_id required" });
  }
  if (jump_code) {
    console.log("TODO: player is jumping from another device.");
  }
  // first game ? you will need a new player_id
  const created = await Player.newPlayer(last_user_id);
  if (!created.ok) {
    res.status(400).json({ message: created.message });
  } else {
    const pid: string = String(created.player_id);
    const token = await newToken(last_user_id, pid, undefined);
    res.status(token.status).json(token);
  }
});

router.post("/update-token", async (req, res) => {
  const { s_id, p_id, name, definition, points } = req.body;
  const extra = b64.encode(JSON.stringify({ name, definition, points }));
  try {
    const token = await newToken(s_id, p_id, extra);
    res.status(200).json({ token });
  } catch (err) {
    res.send(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { user_id, last_token } = req.body;
  if (!user_id || !last_token) {
    res.status(403).json({ message: "missing required elements" });
  }
  const valid = await verifyTricktionaryToken(last_token, user_id);
  if (!valid.ok) {
    res.status(valid.status).json({ message: valid.message });
  }
  const { player, last_lobby } = valid;
  if (!valid.player) {
    res.status(403).json({ message: "token was missing player_id" });
  }
  const player_id: string = String(valid.player_id);
  // validate *new token payload
  const payload = validatePayloadType({
    sub: user_id,
    pid: player_id,
    iat: 0
  });
  if (!payload.ok) {
    res.status(400).json({ message: payload.message });
  }
  let token;
  let old_user_id;
  try {
    let token_request = await newToken(user_id, player_id, undefined); // generate new token & update the player record
    if (token_request.ok) {
      token = token_request.token;
    }
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
  res
    .status(200)
    .json({
      message: "welcome",
      player: { ...player, last_played: last_lobby },
      token,
      old_user_id
    });
});

export default router;
