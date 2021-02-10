import { sendToHost, privateMessage } from "./common";

/**
 * 
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbies game-state
 * @param category what host should listen for
 * @param message information being sent to the host
 */
async function handleMessageHost(
  io: any,
  socket: any,
  lobbies: any,
  category: string,
  message: any
) {
  let ok = await sendToHost(io, socket, lobbies, category, message);
  if (!ok) {
    privateMessage(io, socket, "error", "error sending message to host");
  }
}

export default handleMessageHost;
