import { privateMessage, playerIsHost } from "./common";
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
    lobbies[lobbyCode].host = newHost;
    io.to(newHost).emit("welcome host", guesses);
    privateMessage(io, socket, "info", `ok, set host: ${newHost}`);
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    log(`NOT HOST: ${socket.id}, cannot assign a new host`);
    privateMessage(io, socket, "error", "unauthorized call, punk!");
  }
}

export default handleSetNewHost;
