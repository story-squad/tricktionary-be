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
const model_1 = require("./model");
const router = express_1.Router();
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player_id, game_id } = req.body;
    console.log("NEW PLAYED RECORD.");
    if (!(player_id && game_id)) {
        res.status(400).json({ message: "missing information" });
    }
    const linkedPlayer = yield model_1.played(player_id, game_id);
    if (!linkedPlayer.ok) {
        res.status(400).json({ message: linkedPlayer.message });
    }
    res.status(200).json({ played: linkedPlayer.played });
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
router.get("/games/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game_id = req.params.id;
    if (!game_id) {
        res.status(400).json({ error: "id ?" });
    }
    let result;
    try {
        result = model_1.getPlayers(game_id); // return this player's games.
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
}));
exports.default = router;
//# sourceMappingURL=routes.js.map