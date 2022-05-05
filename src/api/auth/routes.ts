import { Router } from "express";
import { log } from "../../logger";
import { newToken, b64, partialRecall } from "./utils";
import Player from "../player/model";
const router = Router();

const limitFromEnv: number = Number(process.env.USERNAME_CHARACTER_LIMIT);
const usernameCharLimit: number = limitFromEnv > 0 ? limitFromEnv : 12;

router.post("/recall", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "token required" });
  }
  // we have a token,
  const result = partialRecall(token);
  if (!result.ok) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
});

router.get("/find-player/:last_user_id", async (req, res) => {
  const last_user_id = req.params.last_user_id;
  let player;
  let errorMessage = "unknown error";
  if (!last_user_id) {
    return res.status(404).json({ message: "last_user_id required" });
  }
  try {
    player = await Player.findPlayer("last_user_id", last_user_id);
  } catch (err: any) {
    errorMessage = err.message;
    return res.status(400).json({ error: errorMessage });
  }
  return res.status(200).json(player);
});

router.post("/new-player", async (req, res) => {
  let { last_user_id, jump_code } = req.body;
  if (!last_user_id) {
    return res.status(403).json({ message: "last_user_id required" });
  }
  if (jump_code) {
    log("TODO: player is jumping from another device.");
  }
  // first game ? you will need a new player_id
  let created: any;
  try {
    created = await Player.newPlayer(last_user_id);
  } catch (err: any) {
    log(`[!ERROR] newPlayer(${last_user_id})`);
  }
  if (!created?.ok) {
    res.status(400).json({ message: created.message });
    return;
  }
  const pid: string = String(created.player_id);
  let token: any;
  let tokenError: any;
  try {
    token = await newToken(last_user_id, pid, undefined, undefined);
  } catch (err: any) {
    tokenError = err;
  }
  return res.status(token?.status || 400).json(token || tokenError);
});

router.post("/update-token", async (req, res) => {
  const { s_id, p_id, name, definition, points, lobbyCode } = req.body;
  if (name.lenth > usernameCharLimit) {
    return res
      .status(400)
      .json({ message: "exceeded username character limit" });
  }
  const extra = b64.encode(JSON.stringify({ name, definition, points }));
  try {
    log(`UPDATE TOKEN - Socket: ${s_id}, Player: ${p_id}`);
    const token = await newToken(s_id, p_id, extra, lobbyCode);
    await Player.updatePlayer(p_id, { name });
    res.status(200).json(token);
  } catch (err: any) {
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
    result = partialRecall(last_token); // verify this is one of our tokens.
    if (!result.ok) {
      //  bad token detected!
      return res.status(400).json(result);
    }
    player_id = result.player_id || "";
    last_user_id = result.last_user_id || "";
    last_lobby = result.last_lobby || "";
    last_username = result.username || "";
    player = await Player.getPlayer(player_id);
  } catch (err: any) {
    log(err.message);
    return res.json({ message: err.message });
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
  } catch (err: any) {
    return res.status(403).json({ message: err.message });
  }
  // last_lobby will be returned, if it exists, as player.last_lobby
  return res.status(200).json({
    message: "welcome",
    player: { ...player, last_lobby },
    token,
    old_user_id,
    old_user_name,
  });
});

export default router;
