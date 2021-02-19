"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSettings_1 = require("../GameSettings");
function handlePlayAgain(io, socket, lobbyCode, lobbies, settings) {
    const updated = GameSettings_1.GameSettings(settings);
    // todo
    if (!lobbyCode[lobbyCode]) {
        return;
    }
    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: lobbies[lobbyCode].players.map((player) => {
            return Object.assign(Object.assign({}, player), { definition: "" });
        }), phase: "PREGAME", word: "", definition: "", guesses: [], settings: updated });
    io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
    // console.log(lobbies[lobbyCode]);
}
exports.default = handlePlayAgain;
//# sourceMappingURL=handlePlayAgain.js.map