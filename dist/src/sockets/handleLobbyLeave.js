"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleLobbyLeave(io, socket, lobbies) {
    if (Array.from(socket.rooms).length > 1) {
        const lobbyCode = Array.from(socket.rooms)[1];
        socket.leave(lobbyCode);
        const l = lobbies[lobbyCode];
        if (l && l.players && !l.completed) {
            // remove socket.id from player list
            lobbies[lobbyCode].players = lobbies[lobbyCode].players.filter((player) => !player.id === socket.id);
        }
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        // console.log(lobbies[lobbyCode]);
    }
}
exports.default = handleLobbyLeave;
//# sourceMappingURL=handleLobbyLeave.js.map