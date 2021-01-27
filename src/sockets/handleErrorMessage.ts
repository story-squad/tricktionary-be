import { privateMessage } from "./common";

/**
 * emit "error" message to player at socket.id
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param error string
 */
async function handleErrorMessage(io: any, socket: any, error: string) {
  try {
    privateMessage(io, socket, "error", error);
  } catch (err) {
    console.log({ error: err });
  }
}

export default handleErrorMessage;
