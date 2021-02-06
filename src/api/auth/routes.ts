import { Router } from "express";
import jwt from "jsonwebtoken";
//
import secrets from "./secrets";
//
import { validatePayloadType, newToken } from "./utils";
//
import { newPlayer, getPlayer } from "../player/model";
import userRounds from "../userRounds/model";
import Rounds from "../rounds/model";

const router = Router();

router.post("/new-player", async (req, res) => {
  console.log("new player");
  let { last_user_id, jump_code } = req.body;
  if (!last_user_id) {
    res.status(403).json({ message: "last_user_id required" });
  }
  if (jump_code) {
    console.log("TODO: player is jumping from another device.");
  }
  // first game ? you will need a new player_id
  const created = await newPlayer(last_user_id);
  console.log(created);
  if (!created.ok) {
    res.status(400).json({ message: created.message });
  } else {
    const pid: string = String(created.player_id);
    const token = await newToken(last_user_id, pid, undefined);
    res.status(token.status).json(token);
    // player_id = created.player_id;
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
      console.log(existing)
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
  player = {...player, last_played: last_lobby};
  res.status(200).json({ message: "welcome", player, token });
});

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
  let lobby;
  let player;
  try {
    console.log(`player_id: ${player_id}`);
    player = await getPlayer(player_id);
    result = { ok: true, player, lobby: undefined };
  } catch (err) {
    result = {
      ok: false,
      message: err.message,
      lobby: undefined,
      player: undefined
    };
  }
  if (result.ok) {
    // console.log("totalRecall - got player", result);
    // Check for existing game
    // let lobbyCode = result.player?.last_played;
    // if (lobbyCode) {
    //   console.log("FOUND LOBBY CODE: ", lobbyCode);
    //   // return { ok: true, player: result.player, spoilers: lobbyCode };
    // }
    try {
      const { round_id } = await userRounds.findLastRound(
        result.player.last_user_id
      );
      console.log("User Round search ", round_id);
      const last_round = await Rounds.get(round_id);
      const { spoilers } = last_round;
      if (spoilers) {
        console.log("FOUND LOBBY CODE: ", spoilers);
        return { ok: true, player: result.player, spoilers };
      }
    } catch (err) {
      console.log(err.message)
      return {
        ok: false,
        message: err.message,
        spoilers: lobby,
        player
      };
    }
  }
  return result;
}
export default router;
