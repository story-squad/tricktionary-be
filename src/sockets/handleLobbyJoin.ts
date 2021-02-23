import {
  MAX_PLAYERS,
  LC_LENGTH,
  localAxios,
  whereAmI,
  updatePlayerToken,
  privateMessage
} from "./common";
import handleErrorMessage from "./handleErrorMessage";

/**
 * Connects the player with the active game being played.
 * 
 * @param io (socket io)
 * @param socket (socket io)
 * @param username Player's name
 * @param lobbyCode Player's join code
 * @param lobbies game-state
 */
async function handleLobbyJoin(
  io: any,
  socket: any,
  username: string,
  lobbyCode: any,
  lobbies: any
) {
  if (whereAmI(socket) === lobbyCode.trim()) {
    console.log("I am already here");
    // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players)
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
  if (lobbies[lobbyCode].players.length > MAX_PLAYERS) {
    handleErrorMessage(io, socket, `${lobbyCode} has reached the maximum player limit of ${MAX_PLAYERS}`);
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

  if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
    let rejoined =
      lobbies[lobbyCode].players.filter(
        (p: any) => p?.rejoinedAs && p.rejoinedAs === socket.id
      ).length > 0;
    if (lobbies[lobbyCode].phase !== "PREGAME" && !rejoined) {
      // prevent *new players from joining mid-game.
      handleErrorMessage(io, socket, "Game in progress; cannot join.");
      return;
    }
    console.log(
      `${username} ${rejoined ? "re-joined" : "joined"} ${lobbyCode}`
    );
    if (
      !(
        lobbies[lobbyCode].players.filter((p: any) => p.id === socket.id)
          .length > 0
      )
    ) {
      if (!rejoined) {
        // this player is new
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
      } else {
        // this player has returned
        lobbies[lobbyCode] = {
          ...lobbies[lobbyCode],
          players: [
            ...lobbies[lobbyCode].players.map((p: any) => {
              if (p?.rejoinedAs && p.rejoinedAs === socket.id) {
                return { ...p, id: socket.id, connected: true };
              }
              return p;
            })
          ]
        };
      }
      socket.join(lobbyCode);
    }
  }
  privateMessage(io, socket, "welcome", socket.id);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
}
export default handleLobbyJoin;
