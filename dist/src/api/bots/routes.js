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
const utils_1 = require("../auth/utils");
const model_1 = __importDefault(require("./model"));
const router = (0, express_1.Router)();
router.post("/new-bot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { last_user_id, botName, lobbyCode } = req.body;
    if (!last_user_id) {
        return res.status(403).json({ message: "last_user_id required" });
    }
    // first game ? you will need a new player_id
    let created;
    try {
        created = yield model_1.default.newBot(last_user_id, botName, lobbyCode);
    }
    catch (err) {
        (0, logger_1.log)(`[!ERROR] newPlayer(${last_user_id})`);
    }
    if (!(created === null || created === void 0 ? void 0 : created.ok)) {
        res.status(400).json({ message: created.message });
        return;
    }
    const pid = String(created.player_id);
    let token;
    let tokenError;
    try {
        token = yield (0, utils_1.newToken)(last_user_id, pid, undefined, undefined);
    }
    catch (err) {
        tokenError = err;
    }
    return res.status((token === null || token === void 0 ? void 0 : token.status) || 400).json(token || tokenError);
}));
router.get("/namecheck/:username/:lobbycode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.username;
    const last_played = req.params.lobbycode;
    const lc_limit = process.env.LC_LENGTH
        ? Number(process.env.LC_LENGTH)
        : 4;
    if (!name || !last_played) {
        return res.status(400).json({
            error: `required: username ${(name === null || name === void 0 ? void 0 : name.length) > 0}, lobbycode ${(last_played === null || last_played === void 0 ? void 0 : last_played.length) === lc_limit}`,
        });
    }
    return res.status(200).json(yield model_1.default.checkBot(name, last_played));
}));
router.get("/botpid/:username/:lobbycode", (req, res) => {
    const { username, lobbycode } = req.params;
    model_1.default.getBotPID(username, lobbycode)
        .then((botPID) => {
        res.status(200).json(botPID);
    })
        .catch((err) => {
        res
            .status(500)
            .json({ message: "Error getting bot PID", err: err.message });
    });
});
exports.default = router;
//# sourceMappingURL=routes.js.map