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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../../logger");
const model_1 = require("./model");
const router = express_1.Router();
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player_id, game_id } = req.body;
    logger_1.log("NEW SCORE CARD.");
    if (!(player_id && game_id)) {
        res.status(400).json({ message: "missing information" });
    }
    const linkedPlayer = yield model_1.scoreCard(player_id, game_id);
    if (!linkedPlayer.ok) {
        res.status(400).json({ message: linkedPlayer.message });
    }
    res.status(200).json({ score: linkedPlayer.id });
}));
router.get("/player/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    if (!player_id) {
        res.status(400).json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getGames(player_id); // return this player's games.
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
}));
router.get("/player/:pid/game/:gid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.pid;
    const game_id = req.params.gid;
    if (!player_id || !game_id) {
        res.status(400).json({ error: "id ?" });
    }
    let result;
    try {
        result = yield model_1.getPlayerScore(player_id, game_id);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
}));
router.get("/games/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.id;
    if (!game_id) {
        res.status(400).json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getPlayers(game_id); // return this game's players.
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
}));
router.put("/increase/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, points } = req.body;
    if (!player_id || !game_id || !points) {
        res.status(200).json({
            error: `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`,
        });
    }
    try {
        const result = yield model_1.addPoints(player_id, game_id, points);
        res.json(result);
    }
    catch (err) {
        res.json({ error: err.message });
    }
}));
router.put("/decrease/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, points } = req.body;
    if (!player_id || !game_id || !points) {
        res.status(200).json({
            error: `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`,
        });
    }
    try {
        const result = yield model_1.subPoints(player_id, game_id, points);
        res.json(result);
    }
    catch (err) {
        res.json({ error: err.message });
    }
}));
router.put("/def/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, top_definition_id } = req.body;
    if (!player_id || !game_id || !top_definition_id) {
        res.status(200).json({
            error: `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`,
        });
    }
    try {
        const score = yield model_1.updateDefinition(player_id, game_id, top_definition_id);
        res.json(score);
    }
    catch (err) {
        res.json({ error: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map