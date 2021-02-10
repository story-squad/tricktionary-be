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
 * Allow the current host to synchronize timers
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param value seconds
 */
function handleTimeSync(io, socket, lobbies, seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = common_1.whereAmI(socket);
        const checkIfHost = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            console.log(`synchronize timers: ${seconds}`);
            io.to(lobbyCode).emit("synchronize", seconds);
        }
        else {
            console.log(`NOT HOST: ${socket.id}`);
            common_1.privateMessage(io, socket, "error", "unauthorized call, punk!");
        }
    });
}
exports.default = handleTimeSync;
//# sourceMappingURL=handleTimeSync.js.map