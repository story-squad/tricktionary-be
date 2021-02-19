import { whereAmI, playerIsHost, localAxios } from "./common";
import handleErrorMessage from "./handleErrorMessage";

// type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface UserDefinitions {
  [key: string]: { userRounds: []; definitions: [] };
}

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
  const game_id = lobbies[lobbyCode].game_id;
  // get the first 3 players, sorted by points in descending order.
  const topThree = lobbies[lobbyCode].players
    .sort(function (a: any, b: any) {
      return b.points - a.points;
    })
    .slice(0, 3);
  
  // 1) assign the resulting player(s) to constant placeholder values,
  const firstPlace = topThree[0];
  const secondPlace = topThree[1] || undefined;
  const thirdPlace = topThree[2] || undefined;
  // 2) await, at the top level, the result of asynchronous operations
  let mostVotedRound;
  let mvd;
  const results = [];
  function finalFormat(defRecord: any) {
    const { user_id, definition } = defRecord;
    return { user_id, definition };
  }
  // get most voted definition, firstPlace
  try {
    let fp = await localAxios.get(
      `/api/user-rounds/user/${firstPlace.id}/game/${game_id}`
    );
    firstPlace["user_rounds"] = fp.data.user_rounds;
    mostVotedRound = firstPlace.user_rounds.sort(function (a: any, b: any) {
      return b.votes - a.votes;
    })[0].round_id;
    mvd = await localAxios.get(
      `/api/definitions/user/${firstPlace.id}/round/${mostVotedRound}`
    );
    results.push(finalFormat(mvd.data.definition));
  } catch (err) {
    console.log(err.message);
  }
  // get most voted definition, secondPlace
  try {
    if (secondPlace) {
      let sp = await localAxios.get(
        `/api/user-rounds/user/${secondPlace.id}/game/${game_id}`
      );
      secondPlace["user_rounds"] = sp.data.user_rounds;
      mostVotedRound = secondPlace.user_rounds.sort(function (a: any, b: any) {
        return b.votes - a.votes;
      })[0].round_id;
      mvd = await localAxios.get(
        `/api/definitions/user/${secondPlace.id}/round/${mostVotedRound}`
      );
      results.push(finalFormat(mvd.data.definition));
    }
  } catch (err) {
    console.log(err.message);
  }
  // get most voted definition, thirdPlace
  try {
    if (thirdPlace) {
      let tp = await localAxios.get(
        `/api/user-rounds/user/${thirdPlace.id}/game/${game_id}`
      );
      thirdPlace["user_rounds"] = tp.data.user_rounds;
      mostVotedRound = thirdPlace.user_rounds.sort(function (a: any, b: any) {
        return b.votes - a.votes;
      })[0].round_id;
      mvd = await localAxios.get(
        `/api/definitions/user/${thirdPlace.id}/round/${mostVotedRound}`
      );
      results.push(finalFormat(mvd.data.definition));
    }
  } catch (err) {
    console.log(err.message);
  }
  lobbies[lobbyCode].topThree = results;
  // console.log(results);
  lobbies[lobbyCode].phase = "FINALE";
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
}

export default handleSetFinale;
