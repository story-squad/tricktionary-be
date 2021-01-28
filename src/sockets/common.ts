// import * as dotenv from "dotenv";
import util from "util";
import { exec as cmd } from "child_process";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${
    process.env.PORT || 5000
  }`
});
localAxios.defaults.timeout = 10000;
const LC_LENGTH: number = 4; // number of characters in lobbyCode
export { LC_LENGTH, localAxios, fortune, privateMessage, playerIsHost };

const exec = util.promisify(cmd);

async function fortune() {
  // returns a promise
  const { stdout, stderr } = await exec("fortune");
  return { fortune: stdout, error: stderr };
}

/**
 * send message to socket.id
 *
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param listener string
 * @param message string
 *
 * helper function; not directly exposed to the public.
 *
 * please handle all necessary authority role checks, prior to invocation.
 */
async function privateMessage(
  io: any,
  socket: any,
  listener: string,
  message: string
) {
  try {
    const pid = socket.id;
    io.to(pid).emit(listener, message); // private message player
    console.log(`${listener} message -> ${socket.id}`);
  } catch (err) {
    console.log({ [listener]: message });
  }
}

function playerIsHost(socket: any, lobbyCode: any, lobbies: any) {
  try {
    const ok = lobbies[lobbyCode].host === socket.id;
    return { ok };
  } catch (err) {
    return { ok: false, message: err };
  }
}
