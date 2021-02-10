import { playerIsHost, privateMessage, whereAmI } from "./common";

/**
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbies game-state
 * @param playerId socket.id of recipient
 * @param category recipient listener event
 * @param message information being sent to the recipient
 */
async function handleMessagePlayer(
  io: any,
  socket: any,
  lobbies: any,
  playerId: string,
  category: string,
  message: any
) {
  const lobbyCode = whereAmI(socket);
  let checkPlayer = playerIsHost(socket, lobbyCode, lobbies);
  if (!checkPlayer.ok) {
    privateMessage(io, socket, "error", "only the host may directly message a player.");
  }
  privateMessage(io, playerId, category, message);
}

export default handleMessagePlayer;
