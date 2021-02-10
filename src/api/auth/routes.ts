import { Router } from "express";
import jwt from "jsonwebtoken";
//
import secrets from "./secrets";
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
  let { last_user_id, player_id, last_token, jump_code } = req.body;
  if (!last_user_id) {
    res.status(403).json({ message: "last_user_id required" });
  }
  if (!last_token) {
    res.status(403).json({ message: "last_token required" });
  }
  let player;
  let last_lobby;
  try {
    jwt.verify(last_token, secrets.jwtSecret); // verify it's one of ours.
    let mem = partialRecall(last_token);
    if (!mem.ok) {
      res.status(400).json({ message: mem.message });
    }
    player_id = mem.player_id; // remember the player_id ?
    if (last_user_id === mem.last_user_id) {
      // same web socket session, update token and return.
      console.log("ok, same socket");
    }
    const existing = await totalRecall(player_id);
    if (existing.ok) {
      player = existing.player;
      last_lobby = existing.spoilers;
      console.log("last lobby -", last_lobby);
    } else {
      console.log("can't find this player in the db");
      // console.log(existing);
    }
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
  // validate last token
  const payload = validatePayloadType({
    sub: last_user_id,
    pid: player_id,
    iat: 0
  });
  if (!payload.ok) {
    res.status(400).json({ message: payload.message });
  }
  let token;
  try {
    let token_request = await newToken(last_user_id, player_id, undefined); // generate new token & update the player record
    if (token_request.ok) {
      token = token_request.token;
    }
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
  player = { ...player, last_played: last_lobby };
  res.status(200).json({ message: "welcome", player, token });
});

export default router;
