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
exports.verifyTricktionaryToken = exports.totalRecall = exports.partialRecall = exports.b64 = exports.newToken = exports.validatePayloadType = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("../player/model"));
const model_2 = __importDefault(require("../userRounds/model"));
const model_3 = __importDefault(require("../rounds/model"));
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
function generateToken(user_id, player_id, extra, lobbyCode) {
    const payload = {
        sub: user_id,
        pid: player_id,
        iat: Date.now(),
        lob: lobbyCode,
        ext: extra
    };
    const options = {
        expiresIn: "1h"
    };
    return jsonwebtoken_1.default.sign(payload, secrets_1.default.jwtSecret, options);
}
/**
 * create a new token for the player.
 *
 * @param last_user_id socket.id
 * @param player_id Player.id
 */
function newToken(last_user_id, player_id, extra, lobbyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = validatePayloadType({
            sub: last_user_id,
            pid: player_id,
            iat: 0,
            lob: lobbyCode,
            ext: extra
        });
        console.log(payload);
        if (!payload.ok) {
            return { ok: false, message: "bad payload", status: 400 };
        }
        try {
            const token = yield generateToken(last_user_id, player_id, extra, lobbyCode); // generate new token
            yield model_1.default.updatePlayer(player_id, { token, last_user_id }); // update the player record
            return { ok: true, token, message: "token update", status: 200 };
        }
        catch (err) {
            return { ok: false, message: err.message, status: 400 };
        }
    });
}
exports.newToken = newToken;
// encode a string in Base64
const encode64 = (str) => Buffer.from(str, "binary").toString("base64");
// decode a string from Base64
const decode64 = (str) => Buffer.from(str, "base64").toString("binary");
exports.b64 = { encode: encode64, decode: decode64 };
/**
 * @returns player_id, last_user_id (from JWT)
 * @param token JWT
 *
 */
function partialRecall(token) {
    // get player_id & last user_id from the JWT
    const payload = validatePayloadType(jsonwebtoken_1.default.decode(token));
    if (!payload.ok)
        return { ok: false, message: payload.message };
    let username;
    let definition;
    let points;
    let last_lobby;
    if (payload.value.ext) {
        const extra = exports.b64.decode(payload.value.ext);
        username = extra.username;
        definition = extra.definition;
        points = extra.points;
    }
    if (payload.value.lob) {
        last_lobby = payload.value.lob;
    }
    return {
        ok: true,
        last_user_id: payload.value.sub,
        player_id: payload.value.pid,
        username,
        definition,
        points,
        last_lobby
    };
}
exports.partialRecall = partialRecall;
function totalRecall(player_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        let player;
        try {
            player = yield model_1.default.getPlayer(String(player_id));
            result = { ok: true, player, lobby: undefined };
        }
        catch (err) {
            result = {
                ok: false,
                message: err.message,
                lobby: undefined,
                player: undefined
            };
        }
        if (result.ok) {
            // ok, we found the user, now find their last lobby (if it exists)
            try {
                const { round_id } = yield model_2.default.findLastRound(result.player.last_user_id);
                const last_round = yield model_3.default.get(round_id);
                // note: My decision to store the lobby code here was convenient.
                //   I created the spoilers field to store potentially unwanted words from each player.
                //   we have not written that feature yet, so I placed the lobbycode there.
                const { spoilers } = last_round;
                if (spoilers) {
                    return { ok: true, player: result.player, spoilers };
                }
            }
            catch (err) {
                console.log("cannot find a last_lobby of player.");
                return {
                    ok: true,
                    message: err.message,
                    spoilers: undefined,
                    player
                };
            }
        }
        return result;
    });
}
exports.totalRecall = totalRecall;
function verifyTricktionaryToken(last_token, last_user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let last_lobby;
        let player_id;
        let player = {};
        try {
            jsonwebtoken_1.default.verify(last_token, secrets_1.default.jwtSecret); // verify it's one of ours.
            let mem = partialRecall(last_token);
            if (!mem.ok) {
                return { ok: false, status: 400, message: mem.message };
                // res.status(400).json({ message: mem.message });
            }
            // player = mem.player;
            player_id = mem.player_id ? mem.player_id : ""; // remember the player_id ?
            if (last_user_id === mem.last_user_id) {
                // same web socket session, update token and return.
                console.log("same socket");
            }
            if (mem.last_user_id) {
                console.log("partialRecall - last lobby -", mem.last_lobby);
                last_lobby = mem.last_lobby;
                // return { ...mem, status: 200 };
            }
            else {
                // search db for player_id
                const existing = yield totalRecall(mem.player_id);
                if (existing.ok) {
                    player = existing.player;
                    last_lobby = existing.spoilers;
                    console.log("totalRecall - last lobby -", last_lobby);
                }
                else {
                    console.log("can't find this player in the db");
                    // console.log(existing);
                }
            }
            // NOTE: don't need to lookup player by id if we already have the last lobby from JWT
        }
        catch (err) {
            return { ok: false, status: 403, message: err.message };
        }
        return {
            ok: true,
            status: 200,
            last_lobby,
            old_user_id: last_user_id,
            player_id,
            player
        };
    });
}
exports.verifyTricktionaryToken = verifyTricktionaryToken;
//# sourceMappingURL=utils.js.map