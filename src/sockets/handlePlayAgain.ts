import { GameSettings } from "../GameSettings";
import { playerIsHost } from "./common";
function handlePlayAgain(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  settings: any
) {
  const check = playerIsHost(socket, lobbyCode, lobbies);
  if (!check.ok) {
    console.log('error, that player is not host.')
    return;
  }
  const updated = GameSettings(settings);
  if (!lobbies[lobbyCode]) {
    console.log("no lobby, ", lobbyCode);
    return;
  }
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    players: lobbies[lobbyCode].players.map((player: any) => {
      return {
        ...player,
        definition: ""
      };
    }),
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    settings: updated
  };
  io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
}

export default handlePlayAgain;
