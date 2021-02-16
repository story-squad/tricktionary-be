import { LC_LENGTH, localAxios, whereAmI, updatePlayerToken, privateMessage } from "./common";
import handleErrorMessage from "./handleErrorMessage";

async function handleLobbyJoin(
  io: any,
  socket: any,
  username: string,
  lobbyCode: any,
  lobbies: any
) {
  console.log("LOBBY-JOIN");

  // if (whereAmI(socket) === lobbyCode.trim()) {
  //   // console.log("I am already here");
  //   // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players)
  //   io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
  //   return;
  // }
  if (lobbyCode.length !== LC_LENGTH) {
    handleErrorMessage(io, socket, "bad lobby code.");
    return;
  }
  if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
    handleErrorMessage(io, socket, "cool it, hackerman.");
    return;
  }
  try {
    const last_player = await localAxios.get(
      `/api/player/last-user-id/${socket.id}`
    );
    const p_id = last_player.data.player.id;
    await updatePlayerToken(io, socket, p_id, username, "", 0, lobbyCode);
  } catch (err) {
    console.log(err.message);
  }

  if (lobbies[lobbyCode].phase !== "PREGAME") {
    // prevent players from joining mid-game.
    handleErrorMessage(io, socket, "Game in progress; cannot join.");
    return;
  }

  if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
    console.log(`${username} joined ${lobbyCode}`);
    socket.join(lobbyCode);
    if (
      !(
        lobbies[lobbyCode].players.filter((p: any) => p.id === socket.id)
          .length > 0
      )
    ) {
      lobbies[lobbyCode] = {
        ...lobbies[lobbyCode],
        players: [
          ...lobbies[lobbyCode].players,
          {
            id: socket.id,
            username,
            definition: "",
            points: 0,
            connected: true
          }
        ]
      };
    }
  }
  privateMessage(io, socket, "welcome", socket.id);
  // ask others to add this player
  // io.to(lobbyCode).emit("add player", { id: socket.id, username, definition: "", points: 0 })
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
  // right now, sending just the player list knocks everyone out of the room. sending the "game update" works.
  // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players); // send player list
  console.log(lobbies[lobbyCode]);
}
export default handleLobbyJoin;
