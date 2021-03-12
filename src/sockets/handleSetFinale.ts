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
  const finaleTime = Date.now();
  /**
   * extra points, for submitting early, are used to determine leaderboard stats
   */
  const withEpochPoints = lobbies[lobbyCode].players.map((p: any) => {
    /**
     * 1 + the difference between now and when the player submitted their definition
     *
     * *or*
     *
     * a random number between 0 and 2
     */
    const timeDelta = p.definitionEpoch
      ? Math.ceil((finaleTime - p.definitionEpoch) / 1000) + 1
      : Math.random() * 2;
    /**
     * player points + timeDelta
     */
    const points = p.points + timeDelta;
    return { ...p, points };
  });

  const topThree = withEpochPoints
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
  type topThreeListItem = {
    user_id: string;
    definition: string;
    word: string;
  };
  function finalFormat(defRecord: any): topThreeListItem {
    const { user_id, definition, def_word } = defRecord;
    const { word } = def_word;
    console.log({ user_id, definition, word });
    return { user_id, definition, word };
  }

  async function getDef(user_id: string, game_id: string) {
    let result: any = { id: user_id, game: game_id };
    let mvr: any[];
    let mvd: any;
    let r: any;
    let wid: number;
    let rWord: any;
    let def_word: any;
    try {
      let p = await localAxios.get(
        `/api/user-rounds/user/${result.id}/game/${result.game}`
      );
      result["user_rounds"] = p.data.user_rounds;
      // most voted round
      mvr = result.user_rounds.sort(function (a: any, b: any) {
        return b.votes - a.votes;
      })[0].round_id;
      // most voted definition
      mvd = await localAxios.get(
        `/api/definitions/user/${result.id}/round/${mvr}`
      );
      r = await localAxios.get(`/api/round/id/${mvr}`);
      wid = r.data.round.word_id;
      rWord = await localAxios.get(`/api/words/id/${wid}`);
      def_word = rWord.data.word;
    } catch (err) {
      console.log(err.message);
      return;
    }
    return finalFormat({ ...mvd.data.definition, user_id, def_word });
  }
  // get most voted definition(s)
  try {
    const firstPlaceResult = await getDef(firstPlace.id, game_id);
    results.push({ ...firstPlaceResult });
  } catch (err) {
    console.log("error getting 1st place");
    console.log(err.message);
  }
  if (secondPlace) {
    try {
      const secondPlaceResult = await getDef(secondPlace.id, game_id);
      results.push({ ...secondPlaceResult });
    } catch (err) {
      console.log("error getting second place");
      console.log(err.message);
    }
  }
  if (thirdPlace) {
    try {
      const thirdPlaceResult = await getDef(thirdPlace.id, game_id);
      results.push({ ...thirdPlaceResult });
    } catch (err) {
      console.log("error getting third place");
      console.log(err.message);
    }
  }
  // add results to game-data & change phase
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    topThree: results,
    phase: "FINALE"
  };
  // update players
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
}

export default handleSetFinale;
