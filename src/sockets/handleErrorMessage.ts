import { privateMessage } from "./common";
import { log } from "../logger";
/**
 * emit "error" message to player at socket.id
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param error string
 */
async function handleErrorMessage(
  io: any,
  socket: any,
  code: number,
  error: string | undefined
) {
  try {
    io.to(socket.id).emit("error", code, error);
  } catch (err) {
    log("catch (handleErrorMessage)");

    if (err instanceof Error) log(err.message);
  }
}

export default handleErrorMessage;
