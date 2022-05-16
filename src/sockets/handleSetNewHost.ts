import { privateMessage, playerIsHost, localAxios } from "./common";
import { log } from "../logger";

/**
 *
 * Allow the current host to trade roles with a player. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param newHost playerID-string
 * @param guesses the hosts' list of the other player's guesses
 */
async function handleSetNewHost(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  newHost: string,
  guesses: any[]
) {
  const checkIfHost = playerIsHost(socket, lobbyCode, lobbies);
  if (checkIfHost.ok) {
    log(`${lobbyCode} has a new Host, ${newHost}`);
    // create a score-card if not already existant.
    const hostPlayer = lobbies[lobbyCode].players.filter(
      (p: any) => p.id === newHost
    )[0];
    const pid = hostPlayer?.pid;
    if (!pid) {
      log(`[!ERROR SETTING NEW HOST]`);
    }
    const game_id = lobbies[lobbyCode].game_id;
    const url_path = `/api/score/player/${pid}/game/${game_id}`;
    const username = hostPlayer.username || "(old host)";
    try {
      // ensure host has a score card
      let score = await localAxios.get(url_path);
      if (!score.data.id) {
        log(`creating score card for ${username}`);
        score = await localAxios.post("/api/score/new", {
          game_id,
          playerId: pid,
        });
        log(`created score card ${score.data?.id} for ${username}`);
      }
      lobbies[lobbyCode].host = newHost;
    } catch (err:any) {
      console.log(err);
      return
    }
    io.to(newHost).emit("welcome host", guesses);
    privateMessage(io, socket, "info", `ok, set host: ${newHost}`);
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    log(`NOT HOST: ${socket.id}, cannot assign a new host`);
    privateMessage(io, socket, "error", "unauthorized call, punk!");
  }
}

export default handleSetNewHost;
