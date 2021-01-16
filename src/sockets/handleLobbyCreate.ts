import randomizer from "randomatic";
import { LC_LENGTH } from "./common";
function handleLobbyCreate(
  io: any,
  socket: any,
  username: string,
  lobbies: any
) {
  const lobbyCode = randomizer("A", LC_LENGTH);
  socket.join(lobbyCode);

  lobbies[lobbyCode] = {
    lobbyCode,
    players: [{ id: socket.id, username, definition: "", points: 0 }],
    host: { id: socket.id, username },
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    roundId: null
  };
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  // console.log(lobbies[lobbyCode]);
}
export default handleLobbyCreate;
