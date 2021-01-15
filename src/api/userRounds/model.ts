import db from "../../dbConfig";
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID: string, roundID: number) {
  return db("User-Rounds").insert({ user_id: userID, round_id: roundID });
}
function addAllUserRounds(players: any, roundId: number) {
  players.forEach((player: any) => {
    add(player.id, roundId)
      .then(() => console.log(`added ${player} to round ${roundId}`))
      .catch((err) => {
        console.log(err.message);
        return { ok: false, message: err.message };
      });
  });
  return { ok: true, message: `added ${players.length} players` };
}
export default { addAllUserRounds };
