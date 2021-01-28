import { privateMessage, playerIsHost } from "./common";


/**
 *
 * Allows the host to change game state. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param phase gamestate-string
 */
async function handleSetPhase(io:any, socket: any, lobbyCode: any, lobbies: any, phase: string) {
  const checkIfHost = playerIsHost(socket, lobbyCode, lobbies);
  if (checkIfHost.ok) {
    console.log(`host is setting phase : ${phase}`);
    lobbies[lobbyCode].phase = phase;
    privateMessage(io, socket, "info", `ok, set phase: ${phase}`)
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log(`NOT HOST: ${socket.id}`);
    privateMessage(io, socket, "error", "unauthorized call, punk!")
  }
}

export default handleSetPhase
