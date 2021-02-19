import { whereAmI, playerIsHost } from "./common";
import handleErrorMessage from "./handleErrorMessage";

/**
 * Reveal results to players
 * 
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param guesses array
 */
export default async function handleRevealResults(
  io: any,
  socket: any,
  lobbyCode: string,
  lobbies: any,
  guesses: any[]
) {
  const present = lobbyCode && whereAmI(socket) === lobbyCode;
  if (!present) {
    handleErrorMessage(io, socket, "use your own letter box");
  }
  const authorized = playerIsHost(socket, lobbyCode, lobbies);
  if (!authorized.ok) {
    handleErrorMessage(
      io,
      socket,
      "please don't provoke the saber tooth kittens"
    );
  }
  io.to(lobbyCode).emit("reveal results", guesses);
}
