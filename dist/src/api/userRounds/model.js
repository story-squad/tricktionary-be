"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID, roundID, gameID) {
    return dbConfig_1.default("User-Rounds").insert({ user_id: userID, round_id: roundID, game_id: gameID });
}
function addAllUserRounds(players, roundId, gameID) {
    players.forEach((player) => {
        add(player.id, roundId, gameID)
            .then(() => console.log(`added ${player.id} to round ${roundId}`))
            .catch((err) => {
            console.log(err.message);
            return { ok: false, message: err.message };
        });
    });
    return { ok: true, message: `added ${players.length} players` };
}
function findPlayer(user_id) {
    return dbConfig_1.default("User-Rounds").where({ user_id });
}
function findLastRound(user_id) {
    return dbConfig_1.default("User-Rounds").where({ user_id }).orderBy('round_id', 'desc').first();
}
function findFirstRound(user_id) {
    return dbConfig_1.default("User-Rounds").where({ user_id }).orderBy('round_id', 'asc').first();
}
exports.default = { addAllUserRounds, findPlayer, findLastRound, findFirstRound };
//# sourceMappingURL=model.js.map