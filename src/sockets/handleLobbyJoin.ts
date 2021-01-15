import { LC_LENGTH } from "./common";

function handleLobbyJoin(
  io: any,
  socket: any,
  username: string,
  lobbyCode: any,
  lobbies: any
) {
  if (lobbyCode.length !== LC_LENGTH) {
    return;
  }

  socket.join(lobbyCode);

  if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      player: [
        ...lobbies[lobbyCode].players,
        { id: socket.id, username, definition: "", points: 0 }
      ]
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  console.log(lobbies[lobbyCode]);
}
export default handleLobbyJoin