"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validNumber = exports.range = exports.validateWord = void 0;
function validateWord(wordObj) {
    // word must be a string and cannot be empty
    const skel = { word: undefined, definition: undefined, source: undefined, moderated: false, approved: false };
    const value = Object.assign(Object.assign({}, skel), wordObj);
    if (typeof value.word !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof value.word}`
        };
    }
    // word must be a string and cannot be empty
    if (typeof value.definition !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof value.definition}`
        };
    }
    return { ok: true, value };
}
exports.validateWord = validateWord;
function range(n) {
    return Array.from(Array(n).keys());
}
exports.range = range;
/**
 * is this a number ?
 * @param num string
 *
 * this function exists because typeof(NaN) === "number"; wtfJS!?
 *
 */
function validNumber(num) {
    try {
        const pattern = /[0-9]/g;
        const result = num.match(pattern);
        const n = (result === null || result === void 0 ? void 0 : result.length) > 0 && (result === null || result === void 0 ? void 0 : result.length) === (num === null || num === void 0 ? void 0 : num.length) ? result.join("") : "";
        return n.length > 0;
    }
    catch (err) {
        return false;
    }
}
exports.validNumber = validNumber;
//# sourceMappingURL=utils.js.map