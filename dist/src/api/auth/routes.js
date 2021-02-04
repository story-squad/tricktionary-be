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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = __importDefault(require("./secrets"));
const utils_1 = require("./utils");
const express_1 = require("express");
const model_1 = require("../player/model");
const router = express_1.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { last_user_id, player_id, last_token, jump_code } = req.body;
    let player;
    let token;
    if (last_token) {
        try {
            jsonwebtoken_1.default.verify(last_token, secrets_1.default.jwtSecret); // verify it's one of ours.
            let mem = partialRecall(last_token);
            if (!mem.ok) {
                res.status(400).json({ message: mem.message });
            }
            player_id = mem.player_id; // remember the player_id ?
            if (last_user_id === mem.last_user_id) {
                // same web socket session, update token and return.
                console.log("ok, same socket");
            }
            else {
                /* this may be a re-connect.
                 *
                 * check if game is being played that included
                 * the last_user_id. If so, we'll need to send
                 * this player over to that lobby.
                 */
                totalRecall(player_id);
                console.log("TODO: possible reconnect");
            }
        }
        catch (err) {
            res.status(403).json({ message: err.message });
        }
        // validate last token
    }
    else {
        console.log("no token");
        // you have no token, are you jumping devices?
        if (jump_code) {
            console.log("TODO: player is jumping from another device.");
        }
        // first game ? you will need a new player_id
        const created = yield model_1.newPlayer(last_user_id);
        if (!created.ok) {
            res.status(400).json({ message: created.message });
        }
        else {
            player_id = created.player_id;
        }
    }
    const payload = utils_1.validatePayloadType({
        sub: last_user_id,
        pid: player_id,
        iat: 0
    });
    if (!payload.ok) {
        res.status(400).json({ message: payload.message });
    }
    try {
        token = yield generateToken(last_user_id, player_id); // generate new token
        player = yield model_1.updatePlayer(player_id, { token, last_user_id }); // update the player record
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
    res.status(200).json({ message: "welcome", player });
}));
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
 * @param token JWT
 */
function partialRecall(token) {
    const payload = utils_1.validatePayloadType(jsonwebtoken_1.default.decode(token));
    if (!payload.ok)
        return { ok: false, message: payload.message };
    return {
        ok: true,
        last_user_id: payload.value.sub,
        player_id: payload.value.pid
    };
}
function totalRecall(player_id) {
    return { message: "todo: find the game being played" };
}
exports.default = router;
//# sourceMappingURL=routes.js.map