"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromLobby = void 0;
const common_1 = require("./common");
const logger_1 = require("../logger");
function handleDisconnection(io, socket, lobbies) {
    const lobbyCode = common_1.whereAmI(socket);
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
                logger_1.log(`deleting lobby: ${lobbyCode}`);
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
    const lobbyCode = common_1.whereAmI(socket);
    if (lobbyCode) {
        // remove socket.id from player list
        lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => player.id !== socket.id);
        socket.leave(socket.id);
    }
}
exports.removeFromLobby = removeFromLobby;
//# sourceMappingURL=handleDisconnection.js.map