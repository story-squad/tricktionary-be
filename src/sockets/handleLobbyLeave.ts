function handleLobbyLeave(io: any, socket: any, lobbies: any) {
  if (Array.from(socket.rooms).length > 1) {
    const lobbyCode: any = Array.from(socket.rooms)[1];
    socket.leave(lobbyCode);
    const l = lobbies[lobbyCode];
    if (l && l.players && !l.completed) {
      // remove socket.id from player list
      lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter(
        (player: any) => !player.id === socket.id
      );
    }
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    console.log(lobbies[lobbyCode]);
  }
}
export default handleLobbyLeave;