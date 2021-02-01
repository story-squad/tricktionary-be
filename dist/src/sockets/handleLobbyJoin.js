"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
function handleLobbyJoin(io, socket, username, lobbyCode, lobbies) {
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
    socket.join(lobbyCode);
    if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                ...lobbies[lobbyCode].players,
                { id: socket.id, username, definition: "", points: 0 }
            ] });
    }
    const playerId = socket.id;
    io.to(playerId).emit("welcome", playerId); // private message new player with id
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
    // console.log(lobbies[lobbyCode]);
}
exports.default = handleLobbyJoin;
//# sourceMappingURL=handleLobbyJoin.js.map