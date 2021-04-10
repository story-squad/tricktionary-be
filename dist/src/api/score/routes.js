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
        return res.json({ message: "missing information" });
    }
    try {
        const linkedPlayer = yield model_1.scoreCard(player_id, game_id);
        if (!linkedPlayer.ok) {
            return res.json({ message: linkedPlayer.message });
        }
        return res.json({ score: linkedPlayer.id });
    }
    catch (err) {
        return res.json({ message: err.message });
    }
}));
router.get("/player/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    if (!player_id) {
        return res.json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getGames(player_id); // return this player's games.
    }
    catch (err) {
        return res.json({ error: err.message });
    }
    return res.json(result);
}));
router.get("/player/:pid/game/:gid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.pid;
    const game_id = req.params.gid;
    if (!player_id || !game_id) {
        return res.json({ error: "id ?" });
    }
    let result;
    try {
        result = yield model_1.getPlayerScore(player_id, game_id);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
    return res.json(result);
}));
router.get("/games/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.id;
    if (!game_id) {
        return res.json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getPlayers(game_id); // return this game's players.
    }
    catch (err) {
        return res.json({ error: err.message });
    }
    return res.json(result);
}));
router.put("/increase/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, points } = req.body;
    let errorMessage;
    if (!player_id || !game_id || !points) {
        errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
        return res.json({ error: errorMessage });
    }
    try {
        const result = yield model_1.addPoints(player_id, game_id, points);
        return res.json(result);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
}));
router.put("/decrease/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, points } = req.body;
    let errorMessage;
    if (!player_id || !game_id || !points) {
        errorMessage = `missing required [points: ${points}, game: ${game_id}, player: ${player_id}]`;
        return res.json({ error: errorMessage });
    }
    try {
        const result = yield model_1.subPoints(player_id, game_id, points);
        return res.json(result);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
}));
router.put("/def/:player_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.player_id;
    const { game_id, top_definition_id } = req.body;
    if (!player_id || !game_id || !top_definition_id) {
        let errorMessage = `missing required [top_definition_id: ${top_definition_id}, game: ${game_id}, player: ${player_id}]`;
        return res.status(400).json({ error: errorMessage });
    }
    let result;
    if (!top_definition_id) {
        result = yield model_1.getPlayerScore(player_id, game_id);
        return res.status(200).json({ score: result.score });
    }
    try {
        result = yield model_1.updateDefinition(player_id, game_id, Number(top_definition_id));
        const { score } = result;
        if (result.ok) {
        }
        else {
            res.json(result);
        }
        return res.json(score);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}));
router.post("/latest/:game_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.game_id;
    if (!game_id) {
        return res.json({ ok: false });
    }
    // this route creates the leaderboard, during gameplay
    let leaderboard;
    try {
        leaderboard = yield model_1.getLatest(game_id);
    }
    catch (err) {
        return res.json({ ok: false, error: err });
    }
    if (!(leaderboard === null || leaderboard === void 0 ? void 0 : leaderboard.ok)) {
        // if not ok, tell us why
        return res.json(leaderboard);
    }
    let latestScore = [];
    let countdown = leaderboard.latest.length;
    // update the latest top_definitions, as needed; returning the list
    leaderboard.latest.forEach((scoreCard) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { player_id, points, top_definition_id } = scoreCard;
        logger_1.log(`looking up top definition for player ${player_id}`);
        const checkTop = yield model_1.findTopDefinition(player_id, game_id); // sort
        const latest_top_def = checkTop.ok && ((_a = checkTop === null || checkTop === void 0 ? void 0 : checkTop.top_definition) === null || _a === void 0 ? void 0 : _a.id);
        if (latest_top_def && top_definition_id !== latest_top_def) {
            logger_1.log("top definition changed... updating score-card"); // update
            yield model_1.updateDefinition(player_id, game_id, latest_top_def);
            countdown -= 1;
            latestScore = [
                ...latestScore,
                {
                    player_id,
                    points,
                    top_definition_id: latest_top_def,
                },
            ];
        }
        else {
            logger_1.log(`top definition remains to be ${top_definition_id}`);
            countdown -= 1;
            latestScore = [...latestScore, { player_id, points, top_definition_id }];
        }
        if (countdown < 1) {
            return res.json(yield latestScore);
        }
    }));
}));
exports.default = router;
//# sourceMappingURL=routes.js.map