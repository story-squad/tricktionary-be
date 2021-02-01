"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomatic_1 = __importDefault(require("randomatic"));
const common_1 = require("./common");
function handleLobbyCreate(io, socket, username, lobbies) {
    const lobbyCode = randomatic_1.default("A", common_1.LC_LENGTH);
    socket.join(lobbyCode);
    lobbies[lobbyCode] = {
        lobbyCode,
        players: [{ id: socket.id, username, definition: "", points: 0 }],
        host: socket.id,
        phase: "PREGAME",
        word: "",
        definition: "",
        guesses: [],
        roundId: null
    };
    const playerId = socket.id;
    io.to(playerId).emit("welcome", playerId); // private message host with id
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    // console.log(lobbies[lobbyCode]);
}
exports.default = handleLobbyCreate;
//# sourceMappingURL=handleLobbyCreate.js.map