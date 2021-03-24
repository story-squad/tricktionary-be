import {
  playerIsHost,
  whereAmI,
} from "./common";
import {log} from "../logger";

/**
 * 
 * emit ("synchronize", seconds) to all *connected* players; excluding the current host
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
    // log(`synchronize timers: ${seconds}`);
    const host = lobbies[lobbyCode].host;
    lobbies[lobbyCode].players
      .filter((p: any) => p.id !== host && p.connected)
      .forEach((player: any) => {
        // log(player.username);
        player?.id.length > 0 && io.to(player.id).emit("synchronize", seconds);
      });
  } else {
    log(`${socket.id} not hosting! cannot synchronize timers`);
  }
}

export default handleTimeSync;
