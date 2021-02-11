"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
function handleDisconnection(io, socket, lobbies) {
    const lobbyCode = common_1.whereAmI(socket);
    if (lobbyCode) {
        socket.leave(lobbyCode); // remove the lobbycode from this (dead?) socket
        const l = lobbies[lobbyCode];
        if (l && l.players) {
            // *get the player,
            const oldPlayer = lobbies[lobbyCode].players.filter((player) => player.id === socket.id)[0];
            // remove socket.id from player list
            lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => player === oldPlayer);
            // *put this player in the DEADBEEF room
            lobbies["DEADBEEF"] = [
                ...lobbies["DEADBEEF"],
                { lobbyCode, player: oldPlayer }
            ];
            // *notify other players in the room.
            // io.to(lobbyCode).emit("remove player", socket.id);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
    }
}
exports.default = handleDisconnection;
//# sourceMappingURL=handleDisconnection.js.map