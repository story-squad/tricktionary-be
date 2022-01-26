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
const pseudoRandom_1 = require("../../options/pseudoRandom");
exports.default = { newBot, checkBot, getBotPID };
function newBot(botID, botName, lobbyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = (0, uuid_1.v4)();
        try {
            yield (0, dbConfig_1.default)("Player").insert({
                id: uuId,
                last_user_id: botID,
                name: botName,
                last_played: lobbyCode,
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return { ok: false, message: err.message };
            }
        }
        return { ok: true, player_id: uuId };
    });
}
function getBotPID(botName, lobbyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        let botPID;
        try {
            botPID = yield (0, dbConfig_1.default)("Player")
                .select("id")
                .where({ name: botName, last_played: lobbyCode })
                .first();
        }
        catch (err) {
            if (err instanceof Error) {
                return { ok: false, message: err.message };
            }
        }
        return botPID;
    });
}
function checkBot(username, last_played) {
    return __awaiter(this, void 0, void 0, function* () {
        const players = yield (0, dbConfig_1.default)("Player").where({ last_played });
        const player_names = players.map((p) => p.name.toLowerCase());
        const check = (0, pseudoRandom_1.matchWords)(username.toLowerCase(), player_names);
        return check.length > 0;
    });
}
//# sourceMappingURL=model.js.map