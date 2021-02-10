"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
function handleLobbyJoin(io, socket, username, lobbyCode, lobbies) {
    if (common_1.whereAmI(socket) === lobbyCode.trim()) {
        // console.log("I am already here");
        // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players)
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
        return;
    }
    if (lobbyCode.length !== common_1.LC_LENGTH) {
        handleErrorMessage_1.default(io, socket, "bad lobby code.");
        return;
    }
    if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
        handleErrorMessage_1.default(io, socket, "cool it, hackerman.");
        return;
    }
    if (lobbies[lobbyCode].phase !== "PREGAME") {
        // prevent players from joining mid-game.
        handleErrorMessage_1.default(io, socket, "Game in progress; cannot join.");
        return;
    }
    if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
        console.log(`${username} joined ${lobbyCode}`);
        socket.join(lobbyCode);
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                ...lobbies[lobbyCode].players,
                { id: socket.id, username, definition: "", points: 0 }
            ] });
    }
    const playerId = socket.id;
    io.to(playerId).emit("welcome", playerId); // private message new player with id  
    // ask others to add this player
    io.to(lobbyCode).emit("add player", { id: socket.id, username, definition: "", points: 0 });
    // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
    // right now, sending just the player list knocks everyone out of the room. sending the "game update" works.
    // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players); // send player list
    console.log(lobbies[lobbyCode]);
}
exports.default = handleLobbyJoin;
//# sourceMappingURL=handleLobbyJoin.js.map