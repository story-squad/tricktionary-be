import { Router } from "express";
import { verifyTricktionaryToken } from "./utils";
import { log } from "../../logger";

// import jwt from "jsonwebtoken";
//
// import secrets from "./secrets";
//
import { validatePayloadType, newToken, b64, partialRecall } from "./utils";
//
import Player from "../player/model";
const router = Router();

router.post("/recall", (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "token required" });
  }
  // we have a token,
  const result = partialRecall(token);
  if (!result.ok) {
    res.status(400).json(result);
  }
  res.status(200).json(result);
});

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
    return
  }
  if (jump_code) {
    log("TODO: player is jumping from another device.");
  }
  // first game ? you will need a new player_id
  let created: any;
  try {
    created = await Player.newPlayer(last_user_id);
  } catch (err) {
    log(`[!ERROR] newPlayer(${last_user_id})`);
  }
  if (!created?.ok) {
    res.status(400).json({ message: created.message });
    return
  }
  const pid: string = String(created.player_id);
  let token: any;
  try {
    token = await newToken(last_user_id, pid, undefined, undefined);
  } catch (err) {
    res.status(token?.status || 400).json(token || err);
  }
});

router.post("/update-token", async (req, res) => {
  const { s_id, p_id, name, definition, points, lobbyCode } = req.body;
  const extra = b64.encode(JSON.stringify({ name, definition, points }));
  try {
    const token = await newToken(s_id, p_id, extra, lobbyCode);
    res.status(200).json(token);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { user_id, last_token } = req.body;
  if (!user_id || !last_token) {
    res.status(403).json({ message: "missing required elements" });
  }
  let last_user_id: string = "";
  let last_lobby: string = "";
  let player;
  let player_id: string = "";
  let result;
  let last_username: string = "";
  try {
    console.log('======= partial recall')
    result = partialRecall(last_token); // verify this is one of our tokens.
    console.log(`======= partial-recall ${result}`)
    if (!result.ok) {
      //  bad token detected!
      res.status(400).json(result);
    }
    player_id = result.player_id || "";
    last_user_id = result.last_user_id || "";
    last_lobby = result.last_lobby || "";
    last_username = result.username || "";
    player = await Player.getPlayer(player_id);
  } catch (err) {
    console.log('====== ERROR')
    log(err.message);
    res.json({ message: err.message });
  }
  let token;
  let old_user_id = last_user_id;
  let old_user_name = last_username;
  try {
    let token_request = await newToken(
      user_id,
      player_id,
      undefined,
      last_lobby
    ); // generate new token & update the player record
    if (token_request.ok) {
      token = token_request.token;
    }
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
  // last_lobby will be returned, if it exists, as player.last_lobby
  res.status(200).json({
    message: "welcome",
    player: { ...player, last_lobby },
    token,
    old_user_id,
    old_user_name,
  });
});

export default router;
