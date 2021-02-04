import { localAxios, privateMessage } from "./common";
async function handleLoginAPI(io: any, socket: any, token: string|undefined) {
  const last_user_id = socket.id;
  let login;
  let data = token ? { last_user_id, token } : { last_user_id }
  try {
    login = await localAxios.post('/api/auth/login', data);
    data = login.data;
  } catch (err) {
    return { ok: false, message: err.message };
  }
  privateMessage(io, socket, "token update", login.data)
}

export default handleLoginAPI;
