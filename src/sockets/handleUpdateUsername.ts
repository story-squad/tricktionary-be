
function handleUpdateUsername(
  io: any,
  socket: any,
  newUsername: string,
  lobbies: any,
) {
  if (Array.from(socket.rooms).length > 1) {
    const lobbyCode: any = Array.from(socket.rooms)[1];
    const l = lobbies[lobbyCode]; // get lobby
    if (l && l.players && !l.completed) {
      // *get the player,
      const oldPlayer = lobbies[lobbyCode].players.filter(
        (player: any) => player.id === socket.id
      )[0];
      // update the player name's name
      // const {id, username, definition, points} = oldPlayer;
      const updated = {
        ...oldPlayer,
        username: newUsername
      }
      // remove socket.id from player list
      const oldPlayers = lobbies[lobbyCode].players.filter(
        (player: any) => player === oldPlayer
      );
      lobbies[lobbyCode].players = [
        ...lobbies[lobbyCode].players,
        updated
      ]
      // *notify other players in the room.
      io.to(lobbyCode).emit("updated username", updated);
      // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    }
  }
}
export default handleUpdateUsername;
