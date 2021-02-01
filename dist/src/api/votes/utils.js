"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVote = void 0;
function validateVote(voteObj) {
    if (typeof voteObj.user_id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof voteObj.user_id}`
        };
    }
    if (typeof voteObj.round_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof voteObj.round_id}`
        };
    }
    // usable
    if (typeof voteObj.definition_id !== "number") {
        return {
            ok: true,
            value: Object.assign(Object.assign({}, voteObj), { definition_id: null }) // nullified
        };
    }
    return {
        ok: true,
        value: voteObj // as is
    };
}
exports.validateVote = validateVote;
//# sourceMappingURL=utils.js.map