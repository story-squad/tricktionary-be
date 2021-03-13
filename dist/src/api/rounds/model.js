"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const utils_1 = require("./utils");
// import { log } from "../../logger";
function add(gameState, wordId, lobbyCode) {
    const newRound = utils_1.validateRound({
        word_id: wordId,
        number_players: gameState.players.length,
        spoilers: lobbyCode,
    });
    return newRound.ok
        ? dbConfig_1.default("Rounds").insert(newRound.value).returning("id")
        : newRound.message;
}
function get(roundId) {
    return dbConfig_1.default("Rounds").where({ id: roundId }).first();
}
function roundFinished(roundId) {
    // timestamp when this round finished.
    return dbConfig_1.default("Rounds").where({ id: roundId }).update({ ended_at: dbConfig_1.default.fn.now() });
}
exports.default = { add, get, roundFinished };
//# sourceMappingURL=model.js.map