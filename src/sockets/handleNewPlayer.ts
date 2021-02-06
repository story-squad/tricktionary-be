import { localAxios, privateMessage } from "./common";

async function handleNewPlayer(io: any, socket: any) {
  const last_user_id = socket.id;
  let login;
  let player;
  let newtoken
  try {
    login = await localAxios.post('/api/auth/new-player', { last_user_id });
    console.log(login.data);
    newtoken = login.data.token;
    player = login.data.player;
  } catch (err) {
    return { ok: false, message: err.message };
  }
  privateMessage(io, socket, "token update", newtoken)
}


export default handleNewPlayer;
