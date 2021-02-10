import { localAxios, privateMessage, gameExists } from "./common";

async function handleReturningPlayer(
  io: any,
  socket: any,
  token: string | undefined,
  lobbies: any
) {
  const last_user_id = socket.id;
  let login;
  let newtoken;
  let player;
  let game;
  try {
    login = await localAxios.post("/api/auth/login", {
      last_user_id,
      last_token: token
    });
    player = login.data.player;
    newtoken = login.data.token;
  } catch (err) {
    return { ok: false, message: err.message };
  }
  privateMessage(io, socket, "token update", newtoken);
  if (player.last_played) {
    console.log("found existing lobbyCode: ", player.last_played);
    console.log("checking for on-going game");
    // 
    if (gameExists(player.last_played, lobbies)) {
      console.log("GAME EXISTS");
    }
    game = lobbies[player.last_played];
    if (game?.players) {
      console.log("found game, re-joining");
      socket.join(player.last_played);
      let hosting = false;
      if (lobbies[player.last_played].host === player.last_user_id) {
        // re-claim host role.
        lobbies[player.last_played].host = socket.id;
        hosting = true;
      }
      if (lobbies[player.last_played] && lobbies[player.last_played].players) {
        lobbies[player.last_played] = {
          ...lobbies[player.last_played],
          players: [
            ...lobbies[player.last_played].players,
            {
              id: socket.id,
              username: hosting ? "Host" :  (player.name || "re-joined"),
              definition: "",
              points: 0
            }
          ]
        };
      }
      // update the player record with new socket.id
      await localAxios.put(`/api/player/id/${player.id}`, {
        last_user_id: socket.id,
        last_played: player.last_played
      });
      try {
        // should this update rather than add ?
        await localAxios.post("/api/user-rounds/add-players", {
          players: lobbies[player.last_played].players,
          roundId: lobbies[player.last_played].roundId,
          game_id: lobbies[player.last_played].game_id
        });
      } catch (err) {
        console.log("error: handleStartGame:55");
        privateMessage(io, socket, "error", err.message)
      }
      privateMessage(io, socket, "welcome", socket.id)
      // update the lobby
      io.to(player.last_played).emit(
        "game update",
        lobbies[player.last_played]
      ); // ask room to update
    }
  }
}

export default handleReturningPlayer;
