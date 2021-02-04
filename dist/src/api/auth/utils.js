"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayloadType = void 0;
function validatePayloadType(payload) {
    if (typeof payload.sub !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof payload.sub}`
        };
    }
    if (typeof payload.pid !== "string") {
        return {
            ok: false,
            message: `must be of type string, received ${typeof payload.pid}`
        };
    }
    if (typeof payload.iat !== "number") {
        return {
            ok: false,
            message: `must be of type number, received ${typeof payload.iat}`
        };
    }
    return { ok: true, value: payload }; // as-is
}
exports.validatePayloadType = validatePayloadType;
//# sourceMappingURL=utils.js.map