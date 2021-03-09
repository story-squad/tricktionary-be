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
exports.default = { add, findById, findByEmail };
function add(email, username, fullname, location, external) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = uuid_1.v4();
        let member_id;
        try {
            member_id = yield dbConfig_1.default("Member")
                .insert({
                id: uuId,
                email,
                username,
                fullname,
                location,
                external
            })
                .returning("id");
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, member_id: member_id[0] };
    });
}
function findById(member_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let member;
        try {
            member = yield dbConfig_1.default("Member").where({ id: member_id }).first();
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, member };
    });
}
function findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let member;
        try {
            member = yield dbConfig_1.default("Member").where({ email }).first();
        }
        catch (err) {
            return { ok: false, message: "error" };
        }
        return { ok: true, member };
    });
}
//# sourceMappingURL=model.js.map