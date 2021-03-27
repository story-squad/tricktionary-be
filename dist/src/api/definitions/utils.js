"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefinition = void 0;
function validateDefinition(definitionObj) {
    if (typeof definitionObj.user_id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof definitionObj.user_id}`,
        };
    }
    if (typeof definitionObj.round_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof definitionObj.round_id}`,
        };
    }
    if (typeof definitionObj.definition !== "string") {
        // should we return an error message instead ?
        return {
            ok: true,
            value: Object.assign(Object.assign({}, definitionObj), { definition: null }), // nullified
        };
    }
    return { ok: true, value: definitionObj }; // as-is
}
exports.validateDefinition = validateDefinition;
//# sourceMappingURL=utils.js.map