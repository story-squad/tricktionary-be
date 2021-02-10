import { playerIsHost, privateMessage, whereAmI } from "./common";

/**
 *
 * Allow the current host to synchronize timers
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param value seconds
 */
async function handleTimeSync(
  io: any,
  socket: any,
  lobbies: any,
  seconds: number
) {
  const lobbyCode = whereAmI(socket);
  const checkIfHost = playerIsHost(socket, lobbyCode, lobbies);
  if (checkIfHost.ok) {
    console.log(`synchronize timers: ${seconds}`);
    io.to(lobbyCode).emit("synchronize", seconds);
  } else {
    console.log(`NOT HOST: ${socket.id}`);
    privateMessage(io, socket, "error", "unauthorized call, punk!");
  }
}

export default handleTimeSync;
