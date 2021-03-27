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
const uuid_1 = require("uuid");
function newPlayer(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = uuid_1.v4();
        try {
            yield dbConfig_1.default("Player").insert({ id: uuId, last_user_id: user_id });
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        return { ok: true, player_id: uuId };
    });
}
function updatePlayer(player_id, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        const validUpdate = utils_1.validatePlayerType(Object.assign({ id: player_id }, changes));
        if (!validUpdate.ok) {
            return { ok: false, message: validUpdate.message };
        }
        try {
            const player = yield dbConfig_1.default("Player")
                .where({ id: player_id })
                .update(changes)
                .returning("*");
            return player[0];
        }
        catch (err) {
            return { ok: false, message: err.messge };
        }
    });
}
function bySocketID(last_user_id) {
    return dbConfig_1.default("Player").where({ last_user_id }).first();
}
function getPlayer(player_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dbConfig_1.default("Player").where({ id: player_id }).first();
    });
}
function findPlayer(col_name, value) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dbConfig_1.default("Player")
            .where({ [col_name]: value })
            .first();
    });
}
exports.default = { newPlayer, updatePlayer, getPlayer, findPlayer, bySocketID };
//# sourceMappingURL=model.js.map