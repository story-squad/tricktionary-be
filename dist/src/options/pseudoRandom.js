"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomatic_1 = __importDefault(require("randomatic"));
const logger_1 = require("../logger");
const unsavory_json_1 = __importDefault(require("./unsavory.json"));
function matchWords(subject, words) {
    const regexMetachars = /[(){[*+?.\\^$|]/g;
    const escapeMetaStrings = words.map((w) => w.replace(regexMetachars, "\\$&"));
    const regex = new RegExp("\\b(?:" + escapeMetaStrings.join("|") + ")\\b", "gi");
    return subject.match(regex) || [];
}
function pseudoRandomizer(p, l, options, testing) {
    const raw = testing ? "BECH" : randomatic_1.default(p, l, options);
    const filtered = matchWords(raw, unsavory_json_1.default);
    const unsavoryCode = filtered.length > 0;
    if (unsavoryCode) {
        logger_1.log(`[UNSAVORY!]: ${filtered.join(",")}`);
        return pseudoRandomizer(p, l, options);
    }
    return raw;
}
exports.default = pseudoRandomizer;
//# sourceMappingURL=pseudoRandom.js.map