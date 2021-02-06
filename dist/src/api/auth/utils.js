"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.validatePayloadType = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = require("../player/model");
const secrets_1 = __importDefault(require("./secrets"));
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
function generateToken(user_id, player_id) {
    const payload = {
        sub: user_id,
        pid: player_id,
        iat: Date.now()
    };
    const options = {
        expiresIn: "1d"
    };
    return jsonwebtoken_1.default.sign(payload, secrets_1.default.jwtSecret, options);
}
/**
 * create a new token for the player.
 *
 * @param last_user_id socket.id
 * @param player_id Player.id
 */
function newToken(last_user_id, player_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        const payload = validatePayloadType({
            sub: last_user_id,
            pid: player_id,
            iat: 0
        });
        if (!payload.ok) {
            return { ok: false, message: "bad payload", status: 400 };
        }
        try {
            token = yield generateToken(last_user_id, player_id); // generate new token
            yield model_1.updatePlayer(player_id, { token, last_user_id }); // update the player record
        }
        catch (err) {
            return { ok: false, message: err.message, status: 400 };
        }
        return { ok: true, token, message: "token update", status: 200 };
    });
}
exports.newToken = newToken;
//# sourceMappingURL=utils.js.map