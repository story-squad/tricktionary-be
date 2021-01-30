import { privateMessage, playerIsHost } from "./common";


/**
 *
 * Allow the current host to trade roles with a player. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param newHost playerID-string
 */
async function handleSetNewHost(io:any, socket: any, lobbyCode: any, lobbies: any, newHost: string) {
  const checkIfHost = playerIsHost(socket, lobbyCode, lobbies);
  if (checkIfHost.ok) {
    console.log(`we have a new Host : ${newHost}`);
    lobbies[lobbyCode].host = newHost;
    privateMessage(io, socket, "info", `ok, set host: ${newHost}`)
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log(`NOT HOST: ${socket.id}`);
    privateMessage(io, socket, "error", "unauthorized call, punk!")
  }
}

export default handleSetNewHost
