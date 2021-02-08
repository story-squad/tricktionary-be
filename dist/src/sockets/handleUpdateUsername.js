"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleUpdateUsername(io, socket, newUsername, lobbies) {
    if (Array.from(socket.rooms).length > 1) {
        const lobbyCode = Array.from(socket.rooms)[1];
        const l = lobbies[lobbyCode]; // get lobby
        if (l && l.players && !l.completed) {
            // *get the player,
            const oldPlayer = lobbies[lobbyCode].players.filter((player) => player.id === socket.id)[0];
            // update the player name's name
            // const {id, username, definition, points} = oldPlayer;
            const updated = Object.assign(Object.assign({}, oldPlayer), { username: newUsername });
            // remove socket.id from player list
            const oldPlayers = lobbies[lobbyCode].players.filter((player) => player === oldPlayer);
            lobbies[lobbyCode].players = [
                ...lobbies[lobbyCode].players,
                updated
            ];
            // *notify other players in the room.
            io.to(lobbyCode).emit("updated username", updated);
            // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
    }
}
exports.default = handleUpdateUsername;
//# sourceMappingURL=handleUpdateUsername.js.map