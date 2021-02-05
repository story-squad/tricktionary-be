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
exports.default = { add };
function add(og_host) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = uuid_1.v4();
        let game_req;
        try {
            game_req = yield dbConfig_1.default("Game").insert({
                id: uuId,
                og_host
            }).returning("id");
        }
        catch (err) {
            return { ok: false, message: 'error' };
        }
        return { ok: true, game_id: game_req[0] };
    });
}
// function getAll() {
//   return db("Reactions").select("id", "content").then(records => {
//     return records
//   });
// }
// function getById(id: number) {
//   return db("Reactions").where({ id }).first();
// }
//# sourceMappingURL=model.js.map