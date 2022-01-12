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
exports.removeFromLobby = void 0;
const common_1 = require("./common");
const logger_1 = require("../logger");
function handleDisconnection(io, socket, lobbies) {
    const lobbyCode = (0, common_1.whereAmI)(socket);
    if (lobbyCode) {
        socket.leave(lobbyCode); // remove the lobbycode from this (dead?) socket
        const l = lobbies[lobbyCode];
        if (l && l.players) {
            // *get the player,
            const oldPlayer = lobbies[lobbyCode].players.filter((player) => player.id === socket.id)[0];
            // remove socket.id from player list
            lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => player !== oldPlayer);
            lobbies[lobbyCode].players = [
                ...lobbies[lobbyCode].players,
                Object.assign(Object.assign({}, oldPlayer), { connected: false, pulseCheck: true }),
            ];
            if (lobbies[lobbyCode].players.filter((player) => player.connected)
                .length === 0) {
                // instead of deleting the players, we'll mark them as player.connected= false
                (0, logger_1.log)(`deleting lobby: ${lobbyCode}`);
                delete lobbies[lobbyCode];
            }
            // *notify other players in the room.
            // io.to(lobbyCode).emit("remove player", socket.id);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
    }
}
exports.default = handleDisconnection;
function removeFromLobby(io, socket, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = (0, common_1.whereAmI)(socket);
        if (lobbyCode) {
            // remove socket.id from player list
            lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => player.id !== socket.id);
            // tell player they've been removed.
            yield io.to(socket.id).emit("disconnect me");
            yield socket.leave(lobbyCode);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
    });
}
exports.removeFromLobby = removeFromLobby;
//# sourceMappingURL=handleDisconnection.js.map