import {
  whereAmI,
  playerIsHost,
  tieBreakerMatch,
  doIt,
  localAxios,
} from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { log } from "../logger";

/**
 *
 * Allows the host to store and retrieve
 *
 * 1) three top scoring users
 * 2) these users' top-three definitions for the whole game (from any round)
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 */
async function handleSetFinale(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any
) {
  log("[Finale]");
  const present = lobbyCode && whereAmI(socket) === lobbyCode;
  if (!present) {
    handleErrorMessage(io, socket, 2004, "You're not in the lobby");
  }
  const authorized = playerIsHost(socket, lobbyCode, lobbies);
  if (!authorized.ok) {
    handleErrorMessage(
      io,
      socket,
      2005,
      "You're not the host and can not end the game"
    );
  }
  const game_id = lobbies[lobbyCode].game_id;
  let results: any;
  // get points from the scoreCard
  const checkScores = await localAxios.get(`/api/score/latest/${game_id}`);
  // sort by total game points.
  const checkPoints = checkScores.data
    .sort((a: any, b: any) => b.points - a.points)
    .filter((c: any) => c.top_definition_id); // only players who have submitted definitions
  // cast point values into a set
  const values = new Set(checkPoints.map((v: any) => v.points));
  if (values.size === checkPoints.length) {
    // if player.points are unique, no tie-breaker will be necessary.
    const pids = checkPoints.map((e: any) => e.player_id);
    // filter/sort by player_id/points
    const naturalTopThree = lobbies[lobbyCode].players
      .filter((player: any) => pids.includes(player.pid))
      .sort(function (a: any, b: any) {
        return b.points - a.points;
      });

    results = await doIt(
      game_id,
      naturalTopThree[0],
      naturalTopThree[1] || undefined,
      naturalTopThree[2] || undefined
    );
  } else {
    results = await tieBreakerMatch(checkPoints, game_id, lobbies, lobbyCode);
  }
  // add results to game-data & change phase
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    topThree: results,
    phase: "FINALE",
  };
  // update players
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
}

export default handleSetFinale;
