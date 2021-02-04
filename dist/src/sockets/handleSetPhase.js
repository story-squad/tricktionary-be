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
 * Allows the host to change game state. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param phase gamestate-string
 */
function handleSetPhase(io, socket, lobbyCode, lobbies, phase) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkIfHost = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            console.log(`host is setting phase : ${phase}`);
            // SWITCH STATEMENT WITH PHASE HANDLERS
            // ***FINAL PHASE, TOP 3 PLAYERS WITH THEIR TOP 3 DEFINITIONS
            lobbies[lobbyCode].phase = phase;
            common_1.privateMessage(io, socket, "info", `ok, set phase: ${phase}`);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            console.log(`NOT HOST: ${socket.id}`);
            common_1.privateMessage(io, socket, "error", "unauthorized call, punk!");
        }
    });
}
exports.default = handleSetPhase;
//# sourceMappingURL=handleSetPhase.js.map