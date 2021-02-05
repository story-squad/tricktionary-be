"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRound = void 0;
function validateRound(roundObj) {
    if (typeof roundObj.word_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof roundObj.word_id}`
        };
    }
    if (typeof roundObj.number_players !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof roundObj.word_id}`
        };
    }
    if (roundObj.spoilers && typeof roundObj.spoilers !== "string") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof roundObj.word_id}`
        };
    }
    return { ok: true, value: roundObj };
}
exports.validateRound = validateRound;
//# sourceMappingURL=utils.js.map