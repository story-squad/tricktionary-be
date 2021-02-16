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
const utils_1 = require("./utils");
// import jwt from "jsonwebtoken";
//
// import secrets from "./secrets";
//
const utils_2 = require("./utils");
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
        const token = yield utils_2.newToken(last_user_id, pid, undefined);
        res.status(token.status).json(token);
    }
}));
router.post("/update-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { s_id, p_id, name, definition, points } = req.body;
    const extra = utils_2.b64.encode(JSON.stringify({ name, definition, points }));
    try {
        const token = yield utils_2.newToken(s_id, p_id, extra);
        res.status(200).json({ token });
    }
    catch (err) {
        res.send(400).json({ message: err.message });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, last_token } = req.body;
    if (!user_id || !last_token) {
        res.status(403).json({ message: "missing required elements" });
    }
    const valid = yield utils_1.verifyTricktionaryToken(last_token, user_id);
    if (!valid.ok) {
        res.status(valid.status).json({ message: valid.message });
    }
    console.log("OK TOKEN!");
    const { player, last_lobby } = valid;
    if (!valid.player) {
        res.status(403).json({ message: "token was missing player_id" });
    }
    const player_id = String(valid.player_id);
    // validate *new token payload
    const payload = utils_2.validatePayloadType({
        sub: user_id,
        pid: player_id,
        iat: 0
    });
    if (!payload.ok) {
        res.status(400).json({ message: payload.message });
    }
    let token;
    let old_user_id;
    try {
        let token_request = yield utils_2.newToken(user_id, player_id, undefined); // generate new token & update the player record
        if (token_request.ok) {
            token = token_request.token;
        }
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
    res
        .status(200)
        .json({
        message: "welcome",
        player: Object.assign(Object.assign({}, player), { last_played: last_lobby }),
        token,
        old_user_id
    });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map