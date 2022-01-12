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
const utils_1 = require("./utils");
exports.default = {
    add,
    byUserInRound,
    byPlayerInRound,
    incr,
    decr,
    thisRound,
    findTopDefinition,
    byId
};
function add(userID, playerID, definition, roundID, gameID) {
    // validate object.property types
    const newDefinition = (0, utils_1.validateDefinition)({
        user_id: userID,
        player_id: playerID,
        definition,
        round_id: roundID,
        game_id: gameID,
    });
    return newDefinition.ok
        ? (0, dbConfig_1.default)("definitions").insert(newDefinition.value).returning("id")
        : [-1, newDefinition.message];
}
function byUserInRound(user_id, round_id) {
    return (0, dbConfig_1.default)("definitions").where({ user_id, round_id }).first();
}
function byId(definitionId) {
    return (0, dbConfig_1.default)("definitions").where({ id: definitionId });
}
function byPlayerInRound(player_id, round_id) {
    return (0, dbConfig_1.default)("definitions").where({ player_id, round_id }).first();
}
function thisRound(round_id) {
    return (0, dbConfig_1.default)("definitions").where({ round_id });
}
function incr(player_id, round_id, points) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, dbConfig_1.default)("definitions")
            .where({ player_id, round_id })
            .increment("score", points)
            .returning("score");
    });
}
function decr(player_id, round_id, points) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, dbConfig_1.default)("definitions")
            .where({ player_id, round_id })
            .decrement("score", points)
            .returning("score");
    });
}
function findTopDefinition(player_id, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let top_definition;
        try {
            top_definition = yield (0, dbConfig_1.default)("definitions")
                .where({ player_id, game_id })
                .orderBy("score", "desc")
                .first();
        }
        catch (err) {
            return { ok: false, error: err.message };
        }
        return { ok: true, top_definition };
    });
}
//# sourceMappingURL=model.js.map