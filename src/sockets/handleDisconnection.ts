function handleDisconnection(io: any, socket: any, lobbies: any) {
  if (Array.from(socket.rooms).length > 1) {
    const lobbyCode: any = Array.from(socket.rooms)[1];
    socket.leave(lobbyCode); // remove the lobbycode from this (dead?) socket
    const l = lobbies[lobbyCode];
    if (l && l.players && !l.completed) {
      // *get the player,
      const oldPlayer = lobbies[lobbyCode].players.filter(
        (player: any) => player.id === socket.id
      )[0];
      // remove socket.id from player list
      lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter(
        (player: any) => player === oldPlayer
      );
      // *put this player in the DEADBEEF room
      lobbies["DEADBEEF"] = [
        ...lobbies["DEADBEEF"],
        { lobbyCode, player: oldPlayer }
      ];
      // *notify other players in the room.
      io.to(lobbyCode).emit("remove player", oldPlayer.id);
      // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    }
  }
}
export default handleDisconnection;
