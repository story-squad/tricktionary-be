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
  // 1) three top scoring users
  const game_id = lobbies[lobbyCode].game_id;
  const topThree = lobbies[lobbyCode].players
    .sort(function (a: any, b: any) {
      return b.points - a.points;
    })
    .slice(0, 3);
  const firstPlace = topThree[0];
  const secondPlace = topThree[1] || undefined;
  const thirdPlace = topThree[2] || undefined;
  let mostVotedRound;
  let mvd;
  // let round;
  // let wrd;
  let result = {
    first: undefined,
    second: undefined,
    third: undefined
  }
  try {
    let fp = await localAxios.get(
      `/api/user-rounds/user/${firstPlace.id}/game/${game_id}`
    );
    firstPlace["user_rounds"] = fp.data.user_rounds;
    // console.log(fp.data.user_rounds);
    mostVotedRound = firstPlace.user_rounds.sort(function (a: any, b: any) {
      return b.votes - a.votes;
    })[0].round_id;
    mvd = await localAxios.get(
      `/api/definitions/user/${firstPlace.id}/round/${mostVotedRound}`
    );
    // round = await localAxios.get(`/api/round/id/${mvd.data.round_id}`);
    // wrd = await localAxios.get(`/api/words/id/${round.data.word_id}`);
    result.first = mvd.data.definition   
  } catch (err) {
    console.log(err.message);
  }
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
      // round = await localAxios.get(`/api/round/id/${mvd.data.round_id}`);
      // wrd = await localAxios.get(`/api/words/id/${round.data.word_id}`);
      result.second = mvd.data.definition
    }
  } catch (err) {
    console.log(err.message);
  }

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
      // round = await localAxios.get(`/api/round/id/${mvd.data.round_id}`);
      // wrd = await localAxios.get(`/api/words/id/${round.data.word_id}`);
      result.third = mvd.data.definition
    }
  } catch (err) {
    console.log(err.message);
  }
  //
  // console.log(result);
  lobbies[lobbyCode].topThree = result;
  lobbies[lobbyCode].phase = "FINALE";
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

export default handleSetFinale;
