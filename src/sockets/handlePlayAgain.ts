import { GameSettings } from "../GameSettings";
import { playerIsHost } from "./common";
import { log } from "../logger";
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
  };
  io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
}

export default handlePlayAgain;
