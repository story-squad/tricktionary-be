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
        const checkIfHost = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            (0, logger_1.log)(`host is setting phase : ${phase}`);
            lobbies[lobbyCode].phase = phase;
            (0, common_1.privateMessage)(io, socket, "info", `ok, set phase: ${phase}`);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            (0, logger_1.log)(`NOT HOST: ${socket.id}`);
            (0, common_1.privateMessage)(io, socket, "error", "unauthorized call, punk!");
        }
    });
}
exports.default = handleSetPhase;
//# sourceMappingURL=handleSetPhase.js.map