import { pseudoRandomizer } from "../options";
import { log } from "../logger";

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
    if (last_player.data.player) {
      // create the Game
      og_host = last_player.data.player.id;
      game_id = await createGame(og_host);
    }
  } catch (err) {
    if (err instanceof Error) {
      log(err.message);
    }
  }
  log("LOBBY CREATED BY: " + og_host);
  log("GAME : " + game_id); // returns UNDEFINED
  if (!game_id || !og_host) {
    try {
      log("[!game_id] asking HOST to retry create lobby");
      const newhost = og_host || socket.id;
      // ask player to retry with new token
      const { token } = await updatePlayerToken(
        io,
        socket,
        newhost,
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
      og_host = newhost;
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
