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
const logger_1 = require("../../logger");
const utils_1 = require("./utils");
const model_1 = __importDefault(require("../player/model"));
const router = express_1.Router();
const limitFromEnv = Number(process.env.USERNAME_CHARACTER_LIMIT);
const usernameCharLimit = limitFromEnv > 0 ? limitFromEnv : 12;
router.post("/recall", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "token required" });
    }
    // we have a token,
    const result = utils_1.partialRecall(token);
    if (!result.ok) {
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
});
router.get("/find-player/:last_user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const last_user_id = req.params.last_user_id;
    let player;
    let errorMessage = "unknown error";
    if (!last_user_id) {
        return res.status(404).json({ message: "last_user_id required" });
    }
    try {
        player = yield model_1.default.findPlayer("last_user_id", last_user_id);
    }
    catch (err) {
        errorMessage = err.message;
        return res.status(400).json({ error: errorMessage });
    }
    return res.status(200).json(player);
}));
router.post("/new-player", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { last_user_id, jump_code } = req.body;
    if (!last_user_id) {
        return res.status(403).json({ message: "last_user_id required" });
    }
    if (jump_code) {
        logger_1.log("TODO: player is jumping from another device.");
    }
    // first game ? you will need a new player_id
    let created;
    try {
        created = yield model_1.default.newPlayer(last_user_id);
    }
    catch (err) {
        logger_1.log(`[!ERROR] newPlayer(${last_user_id})`);
    }
    if (!(created === null || created === void 0 ? void 0 : created.ok)) {
        res.status(400).json({ message: created.message });
        return;
    }
    const pid = String(created.player_id);
    let token;
    let tokenError;
    try {
        token = yield utils_1.newToken(last_user_id, pid, undefined, undefined);
    }
    catch (err) {
        tokenError = err;
    }
    return res.status((token === null || token === void 0 ? void 0 : token.status) || 400).json(token || tokenError);
}));
router.post("/update-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { s_id, p_id, name, definition, points, lobbyCode } = req.body;
    if (name.lenth > usernameCharLimit) {
        return res
            .status(400)
            .json({ message: "exceeded username character limit" });
    }
    const extra = utils_1.b64.encode(JSON.stringify({ name, definition, points }));
    try {
        logger_1.log(`UPDATE TOKEN - Socket: ${s_id}, Player: ${p_id}`);
        const token = yield utils_1.newToken(s_id, p_id, extra, lobbyCode);
        yield model_1.default.updatePlayer(p_id, { name });
        res.status(200).json(token);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, last_token } = req.body;
    if (!user_id || !last_token) {
        res.status(403).json({ message: "missing required elements" });
    }
    let last_user_id = "";
    let last_lobby = "";
    let player;
    let player_id = "";
    let result;
    let last_username = "";
    try {
        result = utils_1.partialRecall(last_token); // verify this is one of our tokens.
        if (!result.ok) {
            //  bad token detected!
            return res.status(400).json(result);
        }
        player_id = result.player_id || "";
        last_user_id = result.last_user_id || "";
        last_lobby = result.last_lobby || "";
        last_username = result.username || "";
        player = yield model_1.default.getPlayer(player_id);
    }
    catch (err) {
        logger_1.log(err.message);
        return res.json({ message: err.message });
    }
    let token;
    let old_user_id = last_user_id;
    let old_user_name = last_username;
    try {
        let token_request = yield utils_1.newToken(user_id, player_id, undefined, last_lobby); // generate new token & update the player record
        if (token_request.ok) {
            token = token_request.token;
        }
    }
    catch (err) {
        return res.status(403).json({ message: err.message });
    }
    // last_lobby will be returned, if it exists, as player.last_lobby
    return res.status(200).json({
        message: "welcome",
        player: Object.assign(Object.assign({}, player), { last_lobby }),
        token,
        old_user_id,
        old_user_name,
    });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map