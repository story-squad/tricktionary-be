import { whereAmI } from "./common";

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
function handleEmojiSmash(
  io: any,
  socket: any,
  lobbies: any,
  definitionID: number,
  reactionID: number
) {
  const lobbyCode: string = whereAmI(socket) || "";
  if (!lobbyCode.length) {
    console.log("could not find a lobbyCode for socket with id", socket.id);
    return;
  }
  // 1. create reactions object in lobby data if it doesn't exist
  const reactions: emojiReactions = lobbies[lobbyCode]?.reactions || {};

  if (!reactions[definitionID]) {
    reactions[definitionID] = {};
  } 
  
  if (!reactions[definitionID][reactionID]) {
    reactions[definitionID][reactionID] = 0
  }
  // 2. increment  lobbyData.reactions[definitionId][reactionId]
  reactions[definitionID][reactionID] += 1
  // 3. socket.emit('get reaction', definitionId, reactionId) to all players, including the original sender
  io.to(lobbyCode).emit("get reaction", definitionID, reactionID);
}

export default handleEmojiSmash;
