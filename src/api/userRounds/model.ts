import db from "../../dbConfig";
import { played } from "../played/model";
import { log } from "../../logger";
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID: string, roundID: number, gameID: string) {
  return db("User-Rounds").insert({
    user_id: userID,
    round_id: roundID,
    game_id: gameID,
  });
}
async function addAllUserRounds(players: any, roundId: number, gameID: string) {
  players.forEach(async (player: any) => {
    try {
      await add(player.id, roundId, gameID);
      await played(player.id, gameID);
    } catch (err) {
      log(err.message);
      return { ok: false, message: err.message };
    }
  });
  return { ok: true, message: `added ${players.length} players` };
}

function findPlayer(user_id: string) {
  return db("User-Rounds").where({ user_id });
}

function findLastRound(user_id: string) {
  return db("User-Rounds")
    .where({ user_id })
    .orderBy("round_id", "desc")
    .first();
}
function findFirstRound(user_id: string) {
  return db("User-Rounds")
    .where({ user_id })
    .orderBy("round_id", "asc")
    .first();
}

function findAll(user_id: string, game_id: string) {
  return db("User-Rounds").where({ user_id, game_id });
}

export default {
  addAllUserRounds,
  findPlayer,
  findLastRound,
  findFirstRound,
  findAll,
};
