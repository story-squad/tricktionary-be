"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHostChoice = void 0;
function validateHostChoice(hostChoiceObj) {
    if (typeof hostChoiceObj.word_id_one !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof hostChoiceObj.word_id_one}`
        };
    }
    if (typeof hostChoiceObj.word_id_two !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof hostChoiceObj.word_id_two}`
        };
    }
    if (typeof hostChoiceObj.round_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof hostChoiceObj.round_id}`
        };
    }
    if (typeof hostChoiceObj.times_shuffled !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof hostChoiceObj.times_shuffled}`
        };
    }
    return { ok: true, value: hostChoiceObj }; // as-is
}
exports.validateHostChoice = validateHostChoice;
//# sourceMappingURL=utils.js.map