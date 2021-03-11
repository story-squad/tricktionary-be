"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
/**
 * increase emoji (reactionID) smash counter for definitionID
 * @param io
 * @param socket
 * @param definitionID
 * @param reactionID
 */
function handleEmojiSmash(io, socket, lobbies, definitionID, reactionID) {
    var _a;
    const lobbyCode = common_1.whereAmI(socket) || "";
    if (!lobbyCode.length) {
        console.log("could not find a lobbyCode for socket with id", socket.id);
        return;
    }
    // 1. create reactions object in lobby data if it doesn't exist
    const reactions = ((_a = lobbies[lobbyCode]) === null || _a === void 0 ? void 0 : _a.reactions) || {};
    if (!reactions[definitionID]) {
        reactions[definitionID] = {};
    }
    if (!reactions[definitionID][reactionID]) {
        reactions[definitionID][reactionID] = 0;
    }
    // 2. increment  lobbyData.reactions[definitionId][reactionId]
    reactions[definitionID][reactionID] += 1;
    // 3. socket.emit('get reaction', definitionId, reactionId) to all players, including the original sender
    io.to(lobbyCode).emit("get reaction", definitionID, reactionID);
}
exports.default = handleEmojiSmash;
//# sourceMappingURL=handleEmojiSmash.js.map