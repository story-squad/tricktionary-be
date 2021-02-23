"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSettings_1 = require("../GameSettings");
const common_1 = require("./common");
function handlePlayAgain(io, socket, lobbyCode, lobbies, settings) {
    const check = common_1.playerIsHost(socket, lobbyCode, lobbies);
    if (!check.ok) {
        console.log('error, that player is not host.');
        return;
    }
    const updated = GameSettings_1.GameSettings(settings);
    if (!lobbies[lobbyCode]) {
        console.log("no lobby, ", lobbyCode);
        return;
    }
    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: lobbies[lobbyCode].players.map((player) => {
            return Object.assign(Object.assign({}, player), { definition: "" });
        }), phase: "PREGAME", word: "", definition: "", guesses: [], settings: updated });
    io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
}
exports.default = handlePlayAgain;
//# sourceMappingURL=handlePlayAgain.js.map