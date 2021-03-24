"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const model_1 = require("../score/model");
const logger_1 = require("../../logger");
// variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
function add(userID, roundID, gameID) {
    return dbConfig_1.default("User-Rounds").insert({
        user_id: userID,
        round_id: roundID,
        game_id: gameID,
    });
}
function addAllUserRounds(players, roundId, gameID) {
    return __awaiter(this, void 0, void 0, function* () {
        players.forEach((player) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield add(player.id, roundId, gameID);
                yield model_1.scoreCard(player.id, gameID);
            }
            catch (err) {
                logger_1.log(err.message);
                return { ok: false, message: err.message };
            }
        }));
        return { ok: true, message: `added ${players.length} players` };
    });
}
function findPlayer(user_id) {
    return dbConfig_1.default("User-Rounds").where({ user_id });
}
function findLastRound(user_id) {
    return dbConfig_1.default("User-Rounds")
        .where({ user_id })
        .orderBy("round_id", "desc")
        .first();
}
function findFirstRound(user_id) {
    return dbConfig_1.default("User-Rounds")
        .where({ user_id })
        .orderBy("round_id", "asc")
        .first();
}
function findAll(user_id, game_id) {
    return dbConfig_1.default("User-Rounds").where({ user_id, game_id });
}
exports.default = {
    addAllUserRounds,
    findPlayer,
    findLastRound,
    findFirstRound,
    findAll,
};
//# sourceMappingURL=model.js.map