import { localAxios, privateMessage } from "./common";

/**
 * Create a new Player record for this user
 *
 * @param io (socket io)
 * @param socket (socket io)
 */
async function handleNewPlayer(io: any, socket: any) {
  const lastUserId = socket.id;
  let login;
  let newtoken;
  ``;
  try {
    login = await localAxios.post("/api/auth/new-player", { last_user_id: lastUserId });
    newtoken = login.data.token;
    return { ok: true, token: newtoken };
  } catch (err:any) {
    return { ok: false, message: err.message };
  }
  privateMessage(io, socket, "token update", newtoken);
}

export default handleNewPlayer;
