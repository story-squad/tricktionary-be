import { whereAmI, localAxios } from "./common";
import { log } from "../logger";

async function getReactions(io: any, socket: any, lobbies: any) {
  const lobbyCode: string = whereAmI(socket) || "";
  if (!lobbyCode.length) {
    log(`could not find a lobbyCode for socket with id ${socket.id}`);
    return;
  }
  const game_id = lobbies[lobbyCode].game_id;
  const roundId = lobbies[lobbyCode].roundId;
  try {
    let { data } = await localAxios.get(
      `/api/smash/totals/${game_id}/${roundId}`
    );
    io.to(socket.id).emit("get reactions", data);
  } catch (err:any) {
    if (err instanceof Error) {
      log(err.message);
    }

    io.to(socket.id).emit("get reactions", []);
  }
}

export default getReactions;
