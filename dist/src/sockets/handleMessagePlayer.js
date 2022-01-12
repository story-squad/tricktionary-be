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
/**
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbies game-state
 * @param playerId socket.id of recipient
 * @param category recipient listener event
 * @param message information being sent to the recipient
 */
function handleMessagePlayer(io, socket, lobbies, playerId, category, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = (0, common_1.whereAmI)(socket);
        let checkPlayer = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
        if (!checkPlayer.ok) {
            (0, common_1.privateMessage)(io, socket, "error", "only the host may directly message a player.");
        }
        io.to(playerId).emit(category, message); // private message player
    });
}
exports.default = handleMessagePlayer;
//# sourceMappingURL=handleMessagePlayer.js.map