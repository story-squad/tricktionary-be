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
    handleErrorMessage(io, socket, 2004, "You are not in the requested game");
  }
  const authorized = playerIsHost(socket, lobbyCode, lobbies);
  if (!authorized.ok) {
    handleErrorMessage(
      io,
      socket,
      2005,
      "You are not the host of the requested game"
    );
    return;
  }

  // Calculate the new placing for the players after point calculation
  const sortPlayersByPoints = lobbies[lobbyCode].players
    .filter((p: any) => lobbies[lobbyCode].host !== p.id)
    .sort((a: any, b: any) => b.points - a.points);

  let placingHelper = 1;

  const newPlayerStandings = sortPlayersByPoints.map(
    (player: any, index: any) => {
      if (sortPlayersByPoints.length > 1) {
        if (index !== 0) {
          const prevPlayer = sortPlayersByPoints[index - 1];

          if (player.points !== prevPlayer.points) {
            placingHelper += 1;
            console.log("different points, add placing", placingHelper);
          } else {
            console.log("Same points, keep placing", placingHelper);
          }
        }
      }

      return {
        ...player,
        playerPlacing: placingHelper,
      };
    }
  );

  // Make sure that the host player is part of the players
  const hostPlayer = lobbies[lobbyCode].players.filter(
    (p: any) => lobbies[lobbyCode].host === p.id
  );

  console.log("new player standings", newPlayerStandings);

  lobbies[lobbyCode].players = [...hostPlayer, ...newPlayerStandings];

  lobbies[lobbyCode].phase = "RESULTS";
  io.to(lobbyCode).emit("reveal results", guesses);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
