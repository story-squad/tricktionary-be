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
 * Allow the current host to trade roles with a player. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param newHost playerID-string
 * @param guesses the hosts' list of the other player's guesses
 */
function handleSetNewHost(io, socket, lobbyCode, lobbies, newHost, guesses) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkIfHost = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            logger_1.log(`${lobbyCode} has a new Host, ${newHost}`);
            lobbies[lobbyCode].host = newHost;
            io.to(newHost).emit("welcome host", guesses);
            common_1.privateMessage(io, socket, "info", `ok, set host: ${newHost}`);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            logger_1.log(`NOT HOST: ${socket.id}, cannot assign a new host`);
            common_1.privateMessage(io, socket, "error", "unauthorized call, punk!");
        }
    });
}
exports.default = handleSetNewHost;
//# sourceMappingURL=handleSetNewHost.js.map