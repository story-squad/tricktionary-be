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
 *
 * emit ("synchronize", seconds) to all *connected* players; excluding the current host
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param value seconds
 */
function handleTimeSync(io, socket, lobbies, seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = (0, common_1.whereAmI)(socket) || "";
        const checkIfHost = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            // log(`synchronize timers: ${seconds}`);
            const host = lobbies[lobbyCode].host;
            lobbies[lobbyCode].players
                .filter((p) => p.id !== host && p.connected)
                .forEach((player) => {
                // log(player.username);
                (player === null || player === void 0 ? void 0 : player.id.length) > 0 && io.to(player.id).emit("synchronize", seconds);
            });
        }
        else {
            (0, logger_1.log)(`${socket.id} not hosting! cannot synchronize timers`);
        }
    });
}
exports.default = handleTimeSync;
//# sourceMappingURL=handleTimeSync.js.map