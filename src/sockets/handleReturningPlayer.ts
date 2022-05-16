import { localAxios, privateMessage } from "./common";
import { log } from "../logger";
import handleLobbyJoin from "./handleLobbyJoin";
import handleNewPlayer from "./handleNewPlayer";

/**
 * Determine whether or not the player should auto re-join an existing game.
 *
 * In the case of a rejoin; It calls **handleLobbyJoin**
 * _after marking the old player with the incoming socket.id_
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param token JWT
 * @param lobbies game-state
 */
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
  let old_user_name: string = "";
  // try logging in with the old token
  try {
    login = await localAxios.post("/api/auth/login", {
      user_id,
      last_token: token,
    });
    if (!login?.data?.token) {
      // we have a bad token.
      // treat them as a new player.
      // (until we have user account)
      return await handleNewPlayer(io, socket);
    }

    console.log("Login Data", login);

    player = login.data.player;
    newtoken = login.data.token;
    old_user_id = login.data.old_user_id;
    old_user_name = login.data.old_user_name;
  } catch (err:any) {
    return { ok: false, message: err.message };
  }
  // send player their new token.
  privateMessage(io, socket, "token update", newtoken);
  // check for last_played activity
  if (!player.last_played || !lobbies[player.last_played]) {
    log(`${player.last_played}, game not found.`);
    return { ok: true, message: "player with no game" };
  }
  // if we're not already in the room,
  if (
    lobbies[player.last_played].players.filter((p: any) => p.id === socket.id)
      .length === 0
  ) {
    // player.last_played has the lobby id, so take the array of players
    // and map over it, returning a new object if the player.id === their old id
    // otherwise return the player
    lobbies[player.last_played].players = lobbies[
      player.last_played
    ].players.map((player: any) => {
      if (player.id === old_user_id) {
        return { ...player, rejoinedAs: socket.id };
      }
      return player;
    });
  }
  if (lobbies[player.last_played].host === old_user_id) {
    // if they were the host, give them back their powers.
    lobbies[player.last_played].host = socket.id;
  }
  // move the player forward.
  log("Player has returned");
  handleLobbyJoin(
    io,
    socket,
    old_user_name,
    player.last_played,
    lobbies,
    true,
    true
  );
}

export default handleReturningPlayer;
