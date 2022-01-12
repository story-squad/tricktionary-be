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
const uuid_1 = require("uuid");
exports.default = { add, get, latest, leaderBoard };
function add(og_host) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = (0, uuid_1.v4)();
        let game_req;
        try {
            game_req = yield (0, dbConfig_1.default)("Game")
                .insert({
                id: uuId,
                og_host,
            })
                .returning("id");
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, game_id: game_req[0] };
    });
}
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield (0, dbConfig_1.default)("Game").returning("id");
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, games: result };
    });
}
function latest(limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield (0, dbConfig_1.default)("Game").orderBy("created_at", "desc").limit(limit);
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, games: result };
    });
}
function leaderBoard(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, dbConfig_1.default)("score")
                .join("definitions", "definitions.id", "score.top_definition_id")
                .join("Player", "Player.id", "definitions.player_id")
                .join("Rounds", "Rounds.id", "definitions.round_id")
                .join("words", "words.id", "Rounds.word_id")
                .select("Player.id as player_id", "Player.name as name", "score.points as score", "score.top_definition_id as top_definition_id", "definitions.definition as top_definition", "definitions.score as top_definition_score", "words.word as word")
                .whereNot({ top_definition_id: null })
                .where("score.game_id", game_id);
        }
        catch (err) {
            console.log(err.message);
            return [];
        }
    });
}
//# sourceMappingURL=model.js.map