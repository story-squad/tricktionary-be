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
exports.getPlayerScore = exports.subPoints = exports.addPoints = exports.getPlayers = exports.getGames = exports.scoreCard = exports.updateDefinition = void 0;
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const uuid_1 = require("uuid");
// import { log } from "../../logger";
function scoreCard(player_id, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = uuid_1.v4();
        try {
            yield dbConfig_1.default("score").insert({ id: uuId, player_id, game_id });
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        return { ok: true, id: uuId };
    });
}
exports.scoreCard = scoreCard;
function getPlayerScore(player_id, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield dbConfig_1.default("score").where({ player_id, game_id }).first();
        }
        catch (err) {
            result = { ok: false, message: err.message };
        }
        return result;
    });
}
exports.getPlayerScore = getPlayerScore;
function getGames(player_id) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        let result;
        try {
            result = yield dbConfig_1.default("score").where({ player_id }).returning("game_id");
        }
        catch (err) {
            result = { ok: false, message: err.message };
        }
        return result;
    });
}
exports.getGames = getGames;
function getPlayers(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        let result;
        try {
            result = yield dbConfig_1.default("score").where({ game_id }).returning("player_id");
        }
        catch (err) {
            result = { ok: false, message: err.message };
        }
        return result;
    });
}
exports.getPlayers = getPlayers;
function addPoints(player_id, game_id, points) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // update players points
            const result = yield dbConfig_1.default("score")
                .where({ game_id, player_id })
                .increment("points", points)
                .returning("points");
            return { ok: true, points: result };
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
    });
}
exports.addPoints = addPoints;
function subPoints(player_id, game_id, points) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // update players points
            const result = yield dbConfig_1.default("score")
                .where({ game_id, player_id })
                .decrement("points", points)
                .returning("points");
            return { ok: true, points: result };
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
    });
}
exports.subPoints = subPoints;
function updateDefinition(player_id, game_id, top_definition_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield dbConfig_1.default("score")
                .where({ game_id, player_id })
                .update({ top_definition_id });
            return { ok: true, score: result };
        }
        catch (err) {
            return { ok: false, error: err.message };
        }
    });
}
exports.updateDefinition = updateDefinition;
//# sourceMappingURL=model.js.map