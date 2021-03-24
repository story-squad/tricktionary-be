import { whereAmI } from "./common";
import { log } from "../logger";

/**
 *
 * remote paint on canvas
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbies memo-object
 * @param coords mouse coordinates [x, y, x, y]
 */
async function handleRemotePaint(
  io: any,
  socket: any,
  lobbies: any,
  coords: number[]
) {
  const lobbyCode = whereAmI(socket);
  if (!lobbyCode) {
      log(`[!ERROR] socket.id ${socket.id}: cannot paint without a lobbyCode`)
      return
  }
  const phase = lobbies[lobbyCode].phase;
  if (phase !== "PAINT") {
    log(`[!ERROR] socket.id ${socket.id}: cannot paint while ${phase}`)
    return
  }
  io.to(lobbyCode).emit("update canvas", [...coords]);
}

export default handleRemotePaint;
