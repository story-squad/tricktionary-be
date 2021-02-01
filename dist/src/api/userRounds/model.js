"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID, roundID) {
    return dbConfig_1.default("User-Rounds").insert({ user_id: userID, round_id: roundID });
}
function addAllUserRounds(players, roundId) {
    players.forEach((player) => {
        add(player.id, roundId)
            .then(() => console.log(`added ${player.id} to round ${roundId}`))
            .catch((err) => {
            console.log(err.message);
            return { ok: false, message: err.message };
        });
    });
    return { ok: true, message: `added ${players.length} players` };
}
exports.default = { addAllUserRounds };
//# sourceMappingURL=model.js.map