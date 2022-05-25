import { localAxios, privateMessage } from "./common";

/**
 * Create a new Player record for this user
 * 
 * @param io (socket io)
 * @param socket (socket io)
 */
async function handleNewPlayer(io: any, socket: any) {
  const last_user_id = socket.id;
  let login;
  let newtoken
  try {
    login = await localAxios.post('/api/auth/new-player', { last_user_id });
    newtoken = login.data.token;
  } catch (err:any){
    return { ok: false, message: err.message };
  }
  privateMessage(io, socket, "token update", newtoken)
}


export default handleNewPlayer;
