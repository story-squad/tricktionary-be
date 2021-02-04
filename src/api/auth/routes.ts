import jwt from "jsonwebtoken";
import secrets from "./secrets";
import { validatePayloadType } from "./utils";
import { Router } from "express";
import { newPlayer, updatePlayer, getPlayer } from "../player/model";

const router = Router();

router.post("/login", async (req, res) => {
  let { last_user_id, player_id, last_token, jump_code } = req.body;
  let player;
  let token;

  if (last_token) {
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
      } else {
        /* this may be a re-connect.
         *
         * check if game is being played that included
         * the last_user_id. If so, we'll need to send
         * this player over to that lobby.
         */
        const existing = await totalRecall(player_id);
        if (existing.ok) player = existing.player;
        console.log("TODO: possible reconnect", player);
      }
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
    // validate last token
  } else {
    console.log("no token");
    // you have no token, are you jumping devices?
    if (jump_code) {
      console.log("TODO: player is jumping from another device.");
    }
    // first game ? you will need a new player_id
    const created = await newPlayer(last_user_id);
    if (!created.ok) {
      res.status(400).json({ message: created.message });
    } else {
      player_id = created.player_id;
    }
  }
  const payload = validatePayloadType({
    sub: last_user_id,
    pid: player_id,
    iat: 0
  });
  if (!payload.ok) {
    res.status(400).json({ message: payload.message });
  }
  try {
    token = await generateToken(last_user_id, player_id); // generate new token
    player = await updatePlayer(player_id, { token, last_user_id }); // update the player record
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
  res.status(200).json({ message: "welcome", player });
});

function generateToken(user_id: string, player_id: string) {
  const payload = {
    sub: user_id,
    pid: player_id,
    iat: Date.now()
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

/**
 * @param token JWT
 */
function partialRecall(token: string) {
  const payload = validatePayloadType(jwt.decode(token));
  if (!payload.ok) return { ok: false, message: payload.message };
  return {
    ok: true,
    last_user_id: payload.value.sub,
    player_id: payload.value.pid
  };
}

async function totalRecall(player_id: string) {
  let result;
  try {
    const player = await getPlayer(player_id);
    result = { ok: true, player };
  } catch (err) {
    result = { ok: false, message: err.message };
  }
  if (result.ok) {
    // Check for existing game
  }
  return result;
}
export default router;
