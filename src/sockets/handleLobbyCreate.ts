import { pseudoRandomizer } from "../options";
import { log } from "../logger";
import handleErrorMessage from "./handleErrorMessage";

import {
  LC_LENGTH,
  localAxios,
  privateMessage,
  updatePlayerToken,
} from "./common";

async function handleLobbyCreate(
  io: any,
  socket: any,
  username: string,
  lobbies: any
) {
  const lobbyCode = pseudoRandomizer("A", LC_LENGTH);
  socket.join(lobbyCode);
  let og_host;
  let request_game;
  let game_id;
  async function createGame(host: string) {
    try {
      request_game = await localAxios.post(`/api/game/new`, { og_host: host });
    } catch (err) {
      if (err instanceof Error) {
        log(err.message);
      }
      return;
    }
    return request_game?.data.ok ? request_game?.data.game_id : undefined;
  }

  try {
    const last_player = await localAxios.get(
      `/api/player/last-user-id/${socket.id}`
    );
    og_host = last_player.data.player?.id;
  } catch (err) {
    if (err instanceof Error) {
      log(err.message);
    }
  }
  if (!og_host) {
    // No player record for this socket (no login, or it failed). Make one: the
    // host's pid goes into its token, and a returning host is looked up by it,
    // so it must be a Player.id, never the socket id.
    try {
      const { data } = await localAxios.post("/api/auth/new-player", {
        last_user_id: socket.id,
      });
      og_host = data?.pid;
    } catch (err) {
      if (err instanceof Error) {
        log(err.message);
      }
    }
  }
  if (!og_host) {
    log("[!ERROR] no player record for HOST, lobby not created");
    socket.leave(lobbyCode);
    handleErrorMessage(
      io,
      socket,
      2003,
      "The lobby could not be created. Please try again."
    );
    return;
  }
  // create the Game
  game_id = await createGame(og_host);
  log("LOBBY CREATED BY: " + og_host);
  log("GAME : " + game_id); // returns UNDEFINED
  if (!game_id) {
    try {
      log("[!game_id] asking HOST to retry create lobby");
      // ask player to retry with new token
      const { token } = await updatePlayerToken(
        io,
        socket,
        og_host,
        username,
        "",
        0,
        lobbyCode,
        "retry create lobby"
      );
      if (!token) {
        log("[!ERROR] creating new token for host");
        return;
      }
      // (restart the process)
      game_id = await createGame(og_host);
      log(`created new token for host with game_id : ${game_id}`);
    } catch (err) {
      log("[ERROR] sending token with 'retry create lobby'");

      if (err instanceof Error) {
        log(err.message);
      }

      return;
    }
  }

  lobbies[lobbyCode] = {
    game_id,
    lobbyCode,
    players: [
      {
        id: socket.id,
        username,
        definition: "",
        points: 0,
        connected: true,
        pid: og_host,
        playerPlacing: 1,
      },
    ],
    bots: [],
    host: socket.id,
    phase: username === "bobrosslives" ? "PAINT" : "PREGAME",
    word: "",
    definition: "",
    category: "",
    guesses: [],
    roundId: null,
    rounds: [
      {
        roundNum: "1",
        scores: [{ playerId: socket.id, playerPID: og_host, score: 0 }],
      },
    ],
  };

  try {
    await updatePlayerToken(io, socket, og_host, username, "", 0, lobbyCode);
  } catch (err) {
    if (err instanceof Error) {
      log(err.message);
    }
  }
  privateMessage(io, socket, "welcome", socket.id);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
export default handleLobbyCreate;
