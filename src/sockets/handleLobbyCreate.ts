import { create } from "node:domain";
import randomizer from "randomatic";
import { log } from "../logger";

import {
  LC_LENGTH,
  localAxios,
  privateMessage,
  updatePlayerToken
} from "./common";

async function handleLobbyCreate(
  io: any,
  socket: any,
  username: string,
  lobbies: any
) {
  const lobbyCode = randomizer("A", LC_LENGTH);
  socket.join(lobbyCode);
  let og_host;
  let request_game;
  let game_id;
  async function createGame(host: string) {
    request_game = await localAxios.post(`/api/game/new`, { og_host: host });
    return request_game?.data.ok ? request_game?.data.game_id : undefined;
  }

  try {
    const last_player = await localAxios.get(
      `/api/player/last-user-id/${socket.id}`
    );
    if (last_player.data.player && last_player.data.player.id) {
      // create the Game
      og_host = last_player.data.player.id;
      game_id = await createGame(og_host);
    }
  } catch (err) {
    log(err.message);
  }
  log("LOBBY CREATED BY: " + og_host);
  log("GAME : " + game_id); // returns UNDEFINED
  if (!game_id || !og_host) {
    try {
      log("[!game_id] asking HOST to retry create lobby")
      const newhost = og_host || socket.id;
      // ask player to retry with new token
      const { token } = await updatePlayerToken(io, socket, newhost, username, "", 0, lobbyCode, "retry create lobby");
      if (!token) {
        log("[!ERROR] creating new token for host");
        return
      }
      // (restart the process)
      og_host = newhost;
      game_id = await createGame(og_host);
      log(`created new token for host with game_id : ${game_id}`);
    } catch (err) {
      log("[ERROR] sending token with 'retry create lobby'");
      log(err.message);
      return
    }
  }
  lobbies[lobbyCode] = {
    game_id,
    lobbyCode,
    players: [
      { id: socket.id, username, definition: "", points: 0, connected: true }
    ],
    host: socket.id,
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    roundId: null
  };
  try {
    await updatePlayerToken(io, socket, og_host, username, "", 0, lobbyCode);
  } catch (err) {
    log(err.message);
  }
  privateMessage(io, socket, "welcome", socket.id);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
export default handleLobbyCreate;
