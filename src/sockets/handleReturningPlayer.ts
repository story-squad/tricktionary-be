import {
  localAxios,
  privateMessage,
  gameExists,
  playerIdWasHost
} from "./common";

async function handleReturningPlayer(
  io: any,
  socket: any,
  token: string | undefined,
  lobbies: any
) {
  const user_id = socket.id;
  let login;
  let newtoken;
  let player;
  let old_user_id: string = "";
  // try logging in with the old token
  try {
    login = await localAxios.post("/api/auth/login", {
      user_id,
      last_token: token
    });
    console.log("DATA", login.data);
    player = login.data.player;
    newtoken = login.data.token;
    old_user_id = login.data.old_user_id;
  } catch (err) {
    return { ok: false, message: err.message };
  }
  // send player their new token.
  privateMessage(io, socket, "token update", newtoken);
  // check for last_played activity
  if (!player.last_played || !gameExists(player.last_played, lobbies)) {
    console.log(player.last_played, " game not found.");
    return;
  }
  socket.join(player.last_played);
  if (lobbies[player.last_played].players.filter((p: any) => p.id === socket.id).length === 0) {
    lobbies[player.last_played].players = lobbies[player.last_played].players.map(
      (player: any) => {
        if (player.id === old_user_id) {
          return { ...player, id: socket.id, connected: true };
        }
        return player;
      }
    );
  }
  if (lobbies[player.last_played].host === old_user_id) {
    // update host
    lobbies[player.last_played].host = socket.id;
    privateMessage(io, socket, "info", `ok, set host: ${socket.id}`);
  }
  console.log("updating from returning player...");
  io.to(player.last_played).emit("game update", lobbies[player.last_played]); // ask room to update
  // finally, we give player the option to rejoin.
  // privateMessage(io, socket, "ask rejoin", player.last_played);
}

export default handleReturningPlayer;
