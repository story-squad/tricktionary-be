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
const model_1 = __importDefault(require("./model"));
const logger_1 = require("../../logger");
const router = express_1.Router();
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId, definition, roundId, pid, game_id } = req.body;
    let result;
    let defId = -1;
    try {
        result = yield model_1.default.add(playerId, pid, definition, roundId, game_id);
        defId = result.pop();
    }
    catch (err) {
        logger_1.log("error! definitions router");
        logger_1.log(err.message);
    }
    if (defId > -1) {
        res.status(201).json({ definitionId: defId });
    }
    else {
        res.status(400).json({ error: "failed to get definition Id" });
    }
}));
/**
 * @returns { user_id, round_id, definition }
 */
router.get("/user/:uid/round/:rid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.uid;
    const round_id = Number(req.params.rid);
    let definition;
    let id;
    try {
        // player's definition this round
        definition = yield model_1.default.byUserInRound(user_id, round_id);
        id = definition.id;
    }
    catch (err) {
        // a blank definition object
        definition = {
            user_id,
            round_id,
            definition: "",
        };
    }
    res.status(200).json({
        id,
        user_id,
        round_id,
        definition,
    });
}));
router.put("/increase/game/:game_id/round/:round_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.game_id;
    const round_id = Number(req.params.round_id);
    const ok_round = round_id > 0;
    const ok_game = (game_id === null || game_id === void 0 ? void 0 : game_id.length) > 0;
    if (!ok_round || !ok_game) {
        return res.status(404).json({ error: "whatcha loooking for holmes?" });
    }
    const points = req.body.points;
    const player_id = req.body.player_id;
    if (!(points > 0)) {
        return res.status(400).json({ error: "points must be > 0" });
    }
    if (!(player_id.length > 0)) {
        return res.status(400).json({ error: "player who ?" });
    }
    try {
        yield model_1.default.incr(player_id, round_id, points);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ ok: true });
}));
router.get("/round/:round_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const round_id = Number(req.params.round_id);
    let data;
    try {
        data = model_1.default.thisRound(round_id);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}));
router.get("/game/:game_id/player/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.game_id;
    const player_id = req.params.player_id;
    const result = yield model_1.default.findTopDefinition(player_id, game_id);
    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }
    return res.json({ top_definition: result.top_definition });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map