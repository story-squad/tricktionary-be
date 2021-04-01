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
exports.default = { getByName, getById, add, getUnmoderatedWord, getApprovedWords, update, getUnmoderatedWordIds, getApprovedWordIds };
function getById(id) {
    return dbConfig_1.default("words").where({ id }).first();
}
function getByName(name) {
    return dbConfig_1.default("words").where({ word: name }).first();
}
function add(word) {
    return dbConfig_1.default("words").insert(word).returning("id");
}
function getUnmoderatedWord() {
    return dbConfig_1.default("words").where({ moderated: false }).first();
}
function getApprovedWords() {
    return dbConfig_1.default("words").where({ moderated: true, approved: true });
}
function getApprovedWordIds() {
    return dbConfig_1.default("words").select("id").where({ moderated: true, approved: true });
}
function getUnmoderatedWordIds() {
    return dbConfig_1.default("words").select("id").where({ moderated: false, approved: false });
}
function update(id, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbConfig_1.default("words")
            .where({ id })
            .update(changes);
        return getById(id);
    });
}
//# sourceMappingURL=model.js.map