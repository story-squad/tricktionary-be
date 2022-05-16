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
  let checkPoints: any;
  try {
    const postScores = await localAxios.post(`/api/score/latest/${game_id}`);
    // sort by total game points.
    checkPoints = postScores.data
      .sort((a: any, b: any) => b.points - a.points)
      .filter((c: any) => c.top_definition_id); // only players who have submitted definitions
  } catch (err:any) {
    log("error posting scores");
  }
  // cast point values into a set
  const values = new Set(checkPoints.map((v: any) => v.points));
  if (values.size === checkPoints.length) {
    // if player.points are unique, no tie-breaker will be necessary.
    const pids = checkPoints.map((e: any) => e.playerId);
    // filter/sort by playerId/points
    const naturalTopThree = lobbies[lobbyCode].players
      .filter((player: any) => pids.includes(player.pid))
      .sort((a: any, b: any) => b.points - a.points);
    results = await doIt(
      game_id,
      naturalTopThree[0],
      naturalTopThree[1] || undefined,
      naturalTopThree[2] || undefined
    );
  } else {
    results = await tieBreakerMatch(checkPoints, game_id, lobbies, lobbyCode);
  }
  let data: [any];
  let topThree: [any];
  let n = 0;
  try {
    // finally, get the updated leaderboard for this game.
    const leaderBoard = await localAxios.get(
      `/api/game/leaderboard/${game_id}`
    );
    data = leaderBoard?.data;
    // merge current user with leaderboard data
    topThree = results.map((r: any) => {
      const cu = lobbies[lobbyCode].players.filter(
        (p: any) => p.id === r.user_id
      )[0];
      const lb =
        data.filter((player: any) => player.playerId === cu.pid)[0] || undefined;
      log(`[${game_id}] ${n+1}${['st', 'nd', 'rd'][n]} place -> ${cu.username}`);
      n++;
      return {
        user_id: r.user_id,
        definition: lb?.top_definition || r.definition,
        word: lb?.word || r.word,
      };
    });
  } catch (err:any) {
    log(err);
    // if we have a problem with the leaderboard endpoint, log it and return the current results
    topThree = results;
  }
  // add topThree to game-data & change phase
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    topThree,
    phase: "FINALE",
  };
  // update players
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
}

export default handleSetFinale;
