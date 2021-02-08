"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleDisconnection(io, socket, lobbies) {
    if (Array.from(socket.rooms).length > 1) {
        const lobbyCode = Array.from(socket.rooms)[1];
        socket.leave(lobbyCode); // remove the lobbycode from this (dead?) socket
        const l = lobbies[lobbyCode];
        if (l && l.players && !l.completed) {
            // get the player,
            const oldPlayer = lobbies[lobbyCode].players.filter((player) => player.id === socket.id)[0];
            /*
              oldPlayer
                {
                  id: 'OLD-SOCKET-ID',
                  username: 'Dan',
                  definition: 'pertaining to Redux',
                  points: 1
                }
             */
            // remove socket.id from player list
            lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => !player.id === socket.id);
            io.to(lobbyCode).emit("remove player", oldPlayer.id);
            // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
    }
}
exports.default = handleDisconnection;
//# sourceMappingURL=handleDisconnection.js.map