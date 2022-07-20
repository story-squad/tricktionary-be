import { whereAmI } from "./common";
import { log } from "../logger";

function handleDisconnection(io: any, socket: any, lobbies: any) {
  const lobbyCode = whereAmI(socket);
  if (lobbyCode) {
    socket.leave(lobbyCode); // remove the lobbycode from this (dead?) socket
    const l = lobbies[lobbyCode];
    if (l && l.players) {
      // *get the player,
      const oldPlayer = lobbies[lobbyCode].players.filter(
        (player: any) => player.id === socket.id
      )[0];
      // remove socket.id from player list
      lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter(
        (player: any) => player !== oldPlayer
      );
      lobbies[lobbyCode].players = [
        ...lobbies[lobbyCode].players,
        { ...oldPlayer, connected: false, pulseCheck: true },
      ];

      if (
        lobbies[lobbyCode].players.filter((player: any) => player.connected)
          .length === 0
      ) {
        // instead of deleting the players, we'll mark them as player.connected= false
        log(`deleting lobby: ${lobbyCode}`);
        delete lobbies[lobbyCode];
      }
      // *notify other players in the room.
      // io.to(lobbyCode).emit("remove player", socket.id);
      io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);

      // Send notification to host
      const notificationData = {
        message: "Player Disconnected",
        description: `Player "${oldPlayer.username}" has disconnected`,
        className: "player-disconnected",
      };

      io.to(lobbyCode).emit(
        "receive-notification",
        notificationData,
        socket.id
      );
    }
  }
}
export default handleDisconnection;

export async function removeFromLobby(io: any, socket: any, lobbies: any) {
  const lobbyCode: string | null = whereAmI(socket);
  if (lobbyCode) {
    // GEt the player data
    const playerData = lobbies[lobbyCode].players.filter(
      (player: any) => player.id === socket.id
    )[0];

    // remove socket.id from player list
    lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter(
      (player: any) => player.id !== socket.id
    );

    lobbies[lobbyCode].rounds = lobbies[lobbyCode].rounds.map((round: any) => {
      return {
        roundNum: round.roundNum,
        scores: round.scores.filter((p: any) => p.playerId !== socket.id),
      };
    });

    // tell player they've been removed.
    await io.to(socket.id).emit("disconnect me");
    await socket.leave(lobbyCode);
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);

    // Send notification to host
    const notificationData = {
      message: "Player Left",
      description: `Player "${playerData.username}" has left the game`,
      className: "player-left",
    };

    io.to(lobbyCode).emit("receive-notification", notificationData, socket.id);
  }
}
