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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
const secrets_1 = __importDefault(require("./secrets"));
//
const utils_1 = require("./utils");
//
const model_1 = require("../player/model");
const model_2 = __importDefault(require("../userRounds/model"));
const model_3 = __importDefault(require("../rounds/model"));
const router = express_1.Router();
router.post("/new-player", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("new player");
    let { last_user_id, jump_code } = req.body;
    if (!last_user_id) {
        res.status(403).json({ message: "last_user_id required" });
    }
    if (jump_code) {
        console.log("TODO: player is jumping from another device.");
    }
    // first game ? you will need a new player_id
    const created = yield model_1.newPlayer(last_user_id);
    console.log(created);
    if (!created.ok) {
        res.status(400).json({ message: created.message });
    }
    else {
        const pid = String(created.player_id);
        const token = yield utils_1.newToken(last_user_id, pid);
        res.status(200).json(token);
        // player_id = created.player_id;
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { last_user_id, player_id, last_token, jump_code } = req.body;
    if (!last_user_id) {
        res.status(403).json({ message: "last_user_id required" });
    }
    if (!last_token) {
        res.status(403).json({ message: "last_token required" });
    }
    let player;
    let last_lobby;
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
        const existing = yield totalRecall(player_id);
        if (existing.ok) {
            player = existing.player;
            last_lobby = existing.spoilers;
            console.log("last lobby -", last_lobby);
        }
        else {
            console.log("can't find this player in the db");
            console.log(existing);
        }
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
    // validate last token
    const payload = utils_1.validatePayloadType({
        sub: last_user_id,
        pid: player_id,
        iat: 0
    });
    if (!payload.ok) {
        res.status(400).json({ message: payload.message });
    }
    let token;
    try {
        let token_request = yield utils_1.newToken(last_user_id, player_id); // generate new token & update the player record
        if (token_request.ok) {
            token = token_request.token;
        }
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
    player = Object.assign(Object.assign({}, player), { last_played: last_lobby });
    res.status(200).json({ message: "welcome", player, token });
}));
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
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        let lobby;
        let player;
        try {
            console.log(`player_id: ${player_id}`);
            player = yield model_1.getPlayer(player_id);
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
            // console.log("totalRecall - got player", result);
            // Check for existing game
            // let lobbyCode = result.player?.last_played;
            // if (lobbyCode) {
            //   console.log("FOUND LOBBY CODE: ", lobbyCode);
            //   // return { ok: true, player: result.player, spoilers: lobbyCode };
            // }
            try {
                const { round_id } = yield model_2.default.findLastRound(result.player.last_user_id);
                console.log("User Round search ", round_id);
                const last_round = yield model_3.default.get(round_id);
                const { spoilers } = last_round;
                if (spoilers) {
                    console.log("FOUND LOBBY CODE: ", spoilers);
                    return { ok: true, player: result.player, spoilers };
                }
            }
            catch (err) {
                console.log(err.message);
                return {
                    ok: false,
                    message: err.message,
                    spoilers: lobby,
                    player
                };
            }
        }
        return result;
    });
}
exports.default = router;
//# sourceMappingURL=routes.js.map