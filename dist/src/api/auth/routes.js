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
const model_1 = __importDefault(require("../player/model"));
const router = express_1.Router();
router.get("/find-player/:last_user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const last_user_id = req.params.last_user_id;
    let player;
    let errorMessage = "unknown error";
    if (!last_user_id) {
        res.status(404).json({ message: "last_user_id required" });
    }
    try {
        player = yield model_1.default.findPlayer("last_user_id", last_user_id);
    }
    catch (err) {
        errorMessage = err.message;
        res.status(400).json({ error: errorMessage });
    }
    res.status(200).json(player);
}));
router.post("/new-player", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { last_user_id, jump_code } = req.body;
    if (!last_user_id) {
        res.status(403).json({ message: "last_user_id required" });
    }
    if (jump_code) {
        console.log("TODO: player is jumping from another device.");
    }
    // first game ? you will need a new player_id
    const created = yield model_1.default.newPlayer(last_user_id);
    if (!created.ok) {
        res.status(400).json({ message: created.message });
    }
    else {
        const pid = String(created.player_id);
        const token = yield utils_1.newToken(last_user_id, pid, undefined);
        res.status(token.status).json(token);
    }
}));
router.post("/update-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { s_id, p_id, name, definition, points } = req.body;
    const extra = utils_1.b64.encode(JSON.stringify({ name, definition, points }));
    try {
        const token = yield utils_1.newToken(s_id, p_id, extra);
        res.status(200).json({ token });
    }
    catch (err) {
        res.send(400).json({ message: err.message });
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
        let mem = utils_1.partialRecall(last_token);
        if (!mem.ok) {
            res.status(400).json({ message: mem.message });
        }
        player_id = mem.player_id; // remember the player_id ?
        if (last_user_id === mem.last_user_id) {
            // same web socket session, update token and return.
            console.log("ok, same socket");
        }
        const existing = yield utils_1.totalRecall(player_id);
        if (existing.ok) {
            player = existing.player;
            last_lobby = existing.spoilers;
            console.log("last lobby -", last_lobby);
        }
        else {
            console.log("can't find this player in the db");
            // console.log(existing);
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
        let token_request = yield utils_1.newToken(last_user_id, player_id, undefined); // generate new token & update the player record
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
exports.default = router;
//# sourceMappingURL=routes.js.map