import {
  localAxios,
  VALUE_OF_TRUTH,
  VALUE_OF_BLUFF,
  getCurrentRoundIndex,
  getCurrentPlayerScoreIndex,
} from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { log } from "../logger";

export async function handleArrayOfGuesses(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  guesses: any[]
) {
  let lobby = lobbies[lobbyCode];
  const roundId = lobby.roundId;
  const game_id = lobbies[lobbyCode].game_id;

  // Get current round info
  const curRoundIndex = getCurrentRoundIndex(lobbies, lobbyCode);

  log(`[calculate score] ${lobbyCode}`);
  guesses.forEach(async (g) => {
    try {
      await localAxios.post("/api/votes", {
        userID: g.player,
        definitionID: g.guess,
        roundID: roundId,
      });
      let pointsUpdate: any;
      let definitionUpdate: any;
      lobby.players.forEach(async (player: any) => {
        if (g.guess === 0 && player.id === g.player) {
          player.points += VALUE_OF_TRUTH; // +1 if you voted for the provided definition.

          // Add the points to the current round for the player
          const curPlayerScoreIndex = getCurrentPlayerScoreIndex(
            lobbies,
            lobbyCode,
            player.id
          );

          lobby.rounds[curRoundIndex].scores[curPlayerScoreIndex].score +=
            VALUE_OF_TRUTH;

          // increase player score
          pointsUpdate = await localAxios.put(
            `/api/score/increase/${player.pid}`,
            {
              game_id,
              points: VALUE_OF_TRUTH,
            }
          );
          log(`+${VALUE_OF_TRUTH} truth player : ${player.username}`);

          // log(pointsUpdate.data);
        } else if (g.guess === player.definitionId && g.player !== player.id) {
          player.points += VALUE_OF_BLUFF; // +1 if someone else voted for your definition.

          // Add the points to the current round for the player
          const curPlayerScoreIndex = getCurrentPlayerScoreIndex(
            lobbies,
            lobbyCode,
            player.id
          );

          lobby.rounds[curRoundIndex].scores[curPlayerScoreIndex].score +=
            VALUE_OF_BLUFF;

          // increase player score
          pointsUpdate = await localAxios.put(
            `/api/score/increase/${player.pid}`,
            {
              game_id,
              points: VALUE_OF_BLUFF,
            }
          );
          log(`+${VALUE_OF_BLUFF} Bluff player : ${player.username}`);

          // increase definition score
          definitionUpdate = await localAxios.put(
            `/api/definitions/increase/game/${game_id}/round/${roundId}`,
            {
              player_id: player.pid,
              points: VALUE_OF_BLUFF,
            }
          );
          log(`+${VALUE_OF_TRUTH} definition : ${player.definitionID}`);
          // log(pointsUpdate.data);
          // log(definitionUpdate.data);
        }
      });
    } catch (err:any){
      if (err instanceof Error) {
        log(`error: handleArrayOfGuesses, ${err.message}`);
      }
    }
  });
  try {
    const newRound = await localAxios.post("/api/round/finish", { roundId });
    if (newRound.status === 200) {
      log(`* end of round ${roundId}`);
    }
  } catch (err:any){
    log(`error while ending round!, ${lobbyCode}`);
    handleErrorMessage(
      io,
      socket,
      2003,
      "there was a server error while ending the round"
    );
    return;
  }
  log(`changing phase, ${lobbyCode} -> POSTGAME`);
  lobbies[lobbyCode].phase = "POSTGAME";
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
