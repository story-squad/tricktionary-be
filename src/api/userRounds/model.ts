import db from "../../dbConfig";
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID: string, roundID: number, gameID:string) {
  return db("User-Rounds").insert({ user_id: userID, round_id: roundID, game_id: gameID });
}
function addAllUserRounds(players: any, roundId: number, gameID:string) {
  players.forEach((player: any) => {
    add(player.id, roundId, gameID)
      .then(() => console.log(`added ${player.id} to round ${roundId}`))
      .catch((err) => {
        console.log(err.message);
        return { ok: false, message: err.message };
      });
  });
  return { ok: true, message: `added ${players.length} players` };
}

function findPlayer(user_id: string) {
  return db("User-Rounds").where({ user_id });
}

function findLastRound(user_id: string) {
  return db("User-Rounds").where({ user_id }).orderBy('round_id', 'desc').first();
}
function findFirstRound(user_id: string) {
  return db("User-Rounds").where({ user_id }).orderBy('round_id', 'asc').first();
}

export default { addAllUserRounds, findPlayer, findLastRound, findFirstRound };
