import { localAxios, VALUE_OF_TRUTH, VALUE_OF_BLUFF } from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { log } from "../logger";

export async function handleArrayOfGuesses(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  guesses: any[]
) {
  const lobby = lobbies[lobbyCode];
  const roundId = lobby.roundId;
  const game_id = lobbies[lobbyCode].game_id;
  log(`vote & calculate scores, ${lobbyCode}`);
  guesses.forEach(async (g) => {
    try {
      await localAxios.post("/api/votes", {
        userID: g.player,
        definitionID: g.guess,
        roundID: roundId,
      });
      let pointsUpdate: any;
      lobby.players.forEach(async (player: any) => {
        if (g.guess === 0 && player.id === g.player) {
          player.points += VALUE_OF_TRUTH; // +1 if you voted for the provided definition.
          pointsUpdate = await localAxios.put(
            `/api/score/increase/${player.pid}`,
            {
              game_id,
              points: VALUE_OF_TRUTH,
            }
          );
          log(pointsUpdate.data);
        } else if (g.guess === player.definitionId && g.player !== player.id) {
          player.points += VALUE_OF_BLUFF; // +1 if someone else voted for your definition.
          pointsUpdate = await localAxios.put(
            `/api/score/increase/${player.pid}`,
            {
              game_id,
              points: VALUE_OF_BLUFF,
            }
          );
          log(pointsUpdate.data);
        }
      });
    } catch (err) {
      log(`error: handleArrayOfGuesses, ${err.message}`);
    }
  });
  try {
    const newRound = await localAxios.post("/api/round/finish", { roundId });
    if (newRound.status === 200) {
      log(`* end of round ${roundId}`);
    }
  } catch (err) {
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
