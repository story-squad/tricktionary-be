"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlayerType = void 0;
function validatePlayerType(player) {
    if (typeof player.id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.sub}`
        };
    }
    if (player.token && typeof player.token !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.token}`
        };
    }
    if (player.game_id && typeof player.game_id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.game_id}`
        };
    }
    if (player.user_id && typeof player.user_id !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.user_id}`
        };
    }
    if (player.jump_code && typeof player.jump_code !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.jump_code}`
        };
    }
    if (player.name && typeof player.name !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof player.name}`
        };
    }
    return { ok: true, value: player }; // as-is
}
exports.validatePlayerType = validatePlayerType;
//# sourceMappingURL=utils.js.map