import { whereAmI, localAxios } from "./common";
import { log } from "../logger";
type emojiReactions = {
  [key: number]: { [key: number]: number };
};
/**
 * increase emoji (reactionID) smash counter for definitionID
 * @param io
 * @param socket
 * @param definitionID
 * @param reactionID
 */
async function handleEmojiSmash(
  io: any,
  socket: any,
  lobbies: any,
  definitionId: number,
  reactionId: number
) {
  const lobbyCode: string = whereAmI(socket) || "";
  if (!lobbyCode.length) {
    log(`could not find a lobbyCode for socket with id ${socket.id}`);
    return;
  }
  const game_id = lobbies[lobbyCode].game_id;
  const roundId = lobbies[lobbyCode].roundId;
  try {
    const { data } = await localAxios.put(`/api/smash/emoji/${lobbyCode}`, {
      game_id,
      roundId,
      definitionId,
      reactionId,
    });
    const { value } = data || 0;
    log(`Definition ${definitionId}, Reaction ${reactionId} : ${value}`);
    // send back result
    io.to(lobbyCode).emit("get reaction", definitionId, reactionId, value);
  } catch (err:any){
    log(
      `[!ERROR] handleEmojiSmash -> Definition ${definitionId}, Reaction ${reactionId}`
    );
  }
}

export default handleEmojiSmash;
