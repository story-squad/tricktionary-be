import { GameSettings } from "../GameSettings";
import { playerIsHost, getCurrentRoundIndex, RoundScoreItem } from "./common";
import { log } from "../logger";
import { Test } from "tslint";
function handlePlayAgain(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any
) {
  const check = playerIsHost(socket, lobbyCode, lobbies);
  if (!check.ok) {
    log(`error, ${socket.id} is not host.`);
    return;
  }
  const updated = GameSettings(settings);
  if (!lobbies[lobbyCode]) {
    log(`no lobby named ${lobbyCode}`);
    return;
  }

  // Get the number for the next round
  const nextRound = lobbies[lobbyCode].rounds.length + 1;

  // Get current round index
  const curRoundIndex = getCurrentRoundIndex(lobbies, lobbyCode);

  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    players: lobbies[lobbyCode].players.map((player: any) => {
      return {
        ...player,
        definition: "",
      };
    }),
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    settings: updated,
    rounds: [
      ...lobbies[lobbyCode].rounds,
      {
        roundNum: String(nextRound),
        scores: lobbies[lobbyCode].rounds[curRoundIndex].scores.map(
          (score: RoundScoreItem) => {
            return {
              playerId: score.playerId,
              playerPID: score.playerPID,
              score: 0,
            };
          }
        ),
      },
    ],
  };
  io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
}

export default handlePlayAgain;
