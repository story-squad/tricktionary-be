import { LC_LENGTH, whereAmI } from "./common";
import handleErrorMessage from "./handleErrorMessage";

function handleLobbyJoin(
  io: any,
  socket: any,
  username: string,
  lobbyCode: any,
  lobbies: any
) {
  if (whereAmI(socket) === lobbyCode.trim()) {
    // console.log("I am already here");
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
    return;
  }
  if (lobbyCode.length !== LC_LENGTH) {
    handleErrorMessage(io, socket, "bad lobby code.");
    return;
  }
  if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
    handleErrorMessage(io, socket, "cool it, hackerman.");
    return;
  }
  if (lobbies[lobbyCode].phase !== "PREGAME") {
    // prevent players from joining mid-game.
    handleErrorMessage(io, socket, "Game in progress; cannot join.");
    return;
  }
  
  if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
    console.log(`${username} joined ${lobbyCode}`);
    socket.join(lobbyCode);
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      players: [
        ...lobbies[lobbyCode].players,
        { id: socket.id, username, definition: "", points: 0 }
      ]
    };
  }
  const playerId = socket.id;
  io.to(playerId).emit("welcome", playerId); // private message new player with id
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
  console.log(lobbies[lobbyCode]);
}
export default handleLobbyJoin;
