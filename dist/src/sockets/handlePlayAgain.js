"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSettings_1 = require("../GameSettings");
const common_1 = require("./common");
const logger_1 = require("../logger");
function handlePlayAgain(io, socket, lobbyCode, lobbies, settings) {
    const check = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
    if (!check.ok) {
        (0, logger_1.log)(`error, ${socket.id} is not host.`);
        return;
    }
    const updated = (0, GameSettings_1.GameSettings)(settings);
    if (!lobbies[lobbyCode]) {
        (0, logger_1.log)(`no lobby named ${lobbyCode}`);
        return;
    }
    // Get the number for the next round
    const nextRound = lobbies[lobbyCode].rounds.length + 1;
    // Get current round index
    const curRoundIndex = (0, common_1.getCurrentRoundIndex)(lobbies, lobbyCode);
    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: lobbies[lobbyCode].players.map((player) => {
            return Object.assign(Object.assign({}, player), { definition: "" });
        }), phase: "PREGAME", word: "", definition: "", guesses: [], settings: updated, rounds: [
            ...lobbies[lobbyCode].rounds,
            {
                roundNum: String(nextRound),
                scores: lobbies[lobbyCode].rounds[curRoundIndex].scores.map((score) => {
                    return { playerId: score.playerId, score: 0 };
                }),
            },
        ] });
    io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
}
exports.default = handlePlayAgain;
//# sourceMappingURL=handlePlayAgain.js.map