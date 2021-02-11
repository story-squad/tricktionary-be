import { LC_LENGTH, whereAmI } from "./common";
import handleErrorMessage from "./handleErrorMessage";

function handleLobbyJoinWithPassword(
  io: any,
  socket: any,
  username: string,
  password: string,
  lobbyCode: any,
  lobbies: any
) {
  if (!password) {
    console.log("password ?");
    return;
  }
  if (whereAmI(socket) === lobbyCode.trim()) {
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

  if (!lobbies["waiting"]) {
    handleErrorMessage(
      io,
      socket,
      "I don't see any reservations listed for this lobby."
    );
    return;
  }
  const reservation = lobbies["waiting"].filter(
    (r: any) => r.lobbbyCode === lobbyCode && r.password == password
  );
  if (reservation.length === 0) {
    handleErrorMessage(io, socket, "I can't find your reservation.");
    return;
  }
  
  let hosting = false;
  if (reservation[0].old_user_id === lobbyCode[lobbyCode].host) {
    console.log("host is re-joining...");
    hosting = true;
  }
  console.log(`${username} joined ${lobbyCode}`);
  socket.join(lobbyCode);
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    host: hosting ? socket.id : lobbies[lobbyCode].host,
    players: [
      ...lobbies[lobbyCode].players,
      { id: socket.id, username, definition: "", points: 0 }
    ]
  };
  io.to(socket.id).emit("welcome", socket.id); // private message new player with id
  // ask others to add this player
  // io.to(lobbyCode).emit("add player", {
  //   id: socket.id,
  //   username,
  //   definition: "",
  //   points: 0
  // });
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
}
export default handleLobbyJoinWithPassword;
