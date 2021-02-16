import { localAxios, whereAmI } from "./common";

async function handleUpdateUsername(
  io: any,
  socket: any,
  lobbies: any,
  newUsername: string
) {
  const lobbyCode = whereAmI(socket);
  if (!lobbyCode) {
    // not likely to occur... but we can station a guard here to prevent developer-errors.
    console.log("WTF!?");
    return;
  }
  const oldPlayer = lobbies[lobbyCode].players.filter(
    (player: any) => player.id === socket.id
  )[0];
  // update the player name's name witin the lobby
  // const {id, username, definition, points} = oldPlayer;
  const updatedPlayer = {
    ...oldPlayer,
    username: newUsername
  };
  // make a copy of the player list that doesn't include oldPlayer.
  const otherPlayers = lobbies[lobbyCode].players.filter(
    (player: any) => player.id !== socket.id
  );
  // generate a new playerlist that includes this player's updated username.
  lobbies[lobbyCode].players = [...otherPlayers, updatedPlayer];
  // create a new token for the player that includes their username (in case of disconnection)
  try {
    // get the Player Table record id
    const { data } = await localAxios.get(`/api/auth/find-player/${socket.id}`);
    await localAxios.post("/api/auth/update-token", {
      s_id: socket.id,
      p_id: data.id,
      name: updatedPlayer.username,
      definition: updatedPlayer.definition,
      points: updatedPlayer.points,
      lobbyCode
    });
    // *notify other players if the change.
    io.to(lobbyCode).emit(
      "updated username",
      updatedPlayer.id,
      updatedPlayer.username
    );
  } catch (err) {
    console.log(err.message);
  }
  // console.log(lobbies[lobbyCode].players);
  // send the token to the player
  // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
export default handleUpdateUsername;
