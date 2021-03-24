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
        res.json({ message: "missing information" });
    }
    try {
        const linkedPlayer = yield model_1.scoreCard(player_id, game_id);
        if (!linkedPlayer.ok) {
            res.json({ message: linkedPlayer.message });
        }
        res.json({ score: linkedPlayer.id });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}));
router.get("/player/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    if (!player_id) {
        res.json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getGames(player_id); // return this player's games.
    }
    catch (err) {
        res.json({ error: err.message });
    }
    res.json(result);
}));
router.get("/player/:pid/game/:gid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.pid;
    const game_id = req.params.gid;
    if (!player_id || !game_id) {
        res.json({ error: "id ?" });
    }
    let result;
    try {
        result = yield model_1.getPlayerScore(player_id, game_id);
    }
    catch (err) {
        res.json({ error: err.message });
    }
    res.json(result);
}));
router.get("/games/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.id;
    if (!game_id) {
        res.json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getPlayers(game_id); // return this game's players.
    }
    catch (err) {
        res.json({ error: err.message });
    }
    res.json(result);
}));
router.put("/increase/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, points } = req.body;
    let errorMessage;
    if (!player_id || !game_id || !points) {
        errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
        res.json({ error: errorMessage });
    }
    try {
        console.log("adding points...");
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
    let errorMessage;
    if (!player_id || !game_id || !points) {
        errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
        res.json({ error: errorMessage });
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
        let errorMessage = `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`;
        res.json({ error: errorMessage });
    }
    let result;
    if (!top_definition_id) {
        // console.log("GETTING SCORE");
        result = yield model_1.getPlayerScore(player_id, game_id);
        // console.log(result);
        res.json({ score: result.score });
    }
    console.log(req.body);
    try {
        result = yield model_1.updateDefinition(player_id, game_id, Number(top_definition_id));
        const { score } = result;
        if (result.ok) {
            console.log(`score: ${score}`);
        }
        else {
            console.log("error updating score with top definition.");
            res.json(result);
        }
        res.json(score);
    }
    catch (err) {
        res.json({ error: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map