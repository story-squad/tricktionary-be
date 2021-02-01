"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefinitionReaction = void 0;
function validateDefinitionReaction(drObject) {
    if (typeof drObject.user_id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof drObject.user_id}`
        };
    }
    if (typeof drObject.round_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof drObject.round_id}`
        };
    }
    if (typeof drObject.reaction_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof drObject.reaction_id}`
        };
    }
    if (typeof drObject.definition_id !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof drObject.definition_id}`
        };
    }
    if (typeof drObject.game_finished !== "boolean") {
        return {
            ok: false,
            message: `must be of type boolean, received ${typeof drObject.game_finished}`
        };
    }
    return {
        ok: true,
        value: drObject
    };
}
exports.validateDefinitionReaction = validateDefinitionReaction;
//# sourceMappingURL=utils.js.map