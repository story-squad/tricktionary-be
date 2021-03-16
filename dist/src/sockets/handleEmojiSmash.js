"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const logger_1 = require("../logger");
/**
 * increase emoji (reactionID) smash counter for definitionID
 * @param io
 * @param socket
 * @param definitionID
 * @param reactionID
 */
function handleEmojiSmash(io, socket, lobbies, definitionId, reactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = common_1.whereAmI(socket) || "";
        if (!lobbyCode.length) {
            logger_1.log(`could not find a lobbyCode for socket with id ${socket.id}`);
            return;
        }
        const game_id = lobbies[lobbyCode].game_id;
        const roundId = lobbies[lobbyCode].roundId;
        const { data } = yield common_1.localAxios.put(`/api/smash/emoji/${lobbyCode}`, {
            game_id,
            roundId,
            definitionId,
            reactionId
        });
        const { value } = data || 0;
        logger_1.log(`Definition ${definitionId}, Reaction ${reactionId} : ${value}`);
        // send back result
        io.to(lobbyCode).emit("get reaction", definitionId, reactionId, value);
    });
}
exports.default = handleEmojiSmash;
//# sourceMappingURL=handleEmojiSmash.js.map