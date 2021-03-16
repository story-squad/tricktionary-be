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
    handleErrorMessage(io, socket,2004, "You are not in the requested game", );
  }
  const authorized = playerIsHost(socket, lobbyCode, lobbies);
  if (!authorized.ok) {
    handleErrorMessage(
      io,
      socket,
      2005,
      "You are not the host of the requested game"
    );
    return
  }
  lobbies[lobbyCode].phase = "RESULTS";
  io.to(lobbyCode).emit("reveal results", guesses);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
