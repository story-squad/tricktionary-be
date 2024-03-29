import { Router } from "express";
import { log } from "../../logger";
import { newToken } from "../auth/utils";
import Bot from "./model";
const router = Router();

router.post("/new-bot", async (req, res) => {
  let { last_user_id, botName, lobbyCode } = req.body;

  if (!last_user_id) {
    return res.status(403).json({ message: "last_user_id required" });
  }
  // first game ? you will need a new player_id
  let created: any;
  try {
    created = await Bot.newBot(last_user_id, botName, lobbyCode);
  } catch (err) {
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
  } catch (err) {
    tokenError = err;
  }
  return res.status(token?.status || 400).json(token || tokenError);
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
  return res.status(200).json(await Bot.checkBot(name, last_played));
});

router.get("/botpid/:username/:lobbycode", (req, res) => {
  const { username, lobbycode } = req.params;

  Bot.getBotPID(username, lobbycode)
    .then((botPID) => {
      res.status(200).json(botPID);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error getting bot PID", err: err.message });
    });
});

export default router;
