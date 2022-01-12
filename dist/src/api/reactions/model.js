"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
exports.default = { add, getAll, getById };
function add(content) {
    return (0, dbConfig_1.default)("Reactions").insert({ content }).returning("id");
}
function getAll() {
    return (0, dbConfig_1.default)("Reactions").select("id", "content").then(records => {
        return records;
    });
}
function getById(id) {
    return (0, dbConfig_1.default)("Reactions").where({ id }).first();
}
//# sourceMappingURL=model.js.map