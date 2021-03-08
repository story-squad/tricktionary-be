import {
  playerIsHost,
  whereAmI,
} from "./common";

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
  const lobbyCode: string = whereAmI(socket) || "";
  const checkIfHost = playerIsHost(socket, lobbyCode, lobbies);
  if (checkIfHost.ok) {
    // console.log(`synchronize timers: ${seconds}`);
    const host = lobbies[lobbyCode].host;
    lobbies[lobbyCode].players
      .filter((p: any) => p.id !== host && p.connected)
      .forEach((player: any) => {
        // console.log(player.username);
        io.to(player.id).emit("synchronize", seconds);
      });
  } else {
    console.log('not host!') // what message should be sent?
  }
}

export default handleTimeSync;
