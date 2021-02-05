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
const router = express_1.Router();
router.post("/add-players", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // this route is called internally by sockets/handleStartGame
    const { players, roundId, game_id } = req.body;
    if (!(players && roundId))
        res.status(400).json({ message: "missing required information" });
    const result = yield model_1.default.addAllUserRounds(players, Number(roundId), game_id);
    res.status(result.ok ? 201 : 400).json({ message: result.message });
}));
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    let possibilities;
    if (!user_id) {
        res.status(400).json({ ok: false, message: "/:id required" });
    }
    try {
        possibilities = yield model_1.default.findPlayer(user_id);
    }
    catch (err) {
        res.status(200).json({ ok: false, message: err.message });
    }
    res.status(200).json({ ok: true, possibilities });
}));
router.get("/user/:id/last", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    let possibilities;
    if (!user_id) {
        res.status(400).json({ ok: false, message: "/:id required" });
    }
    try {
        possibilities = yield model_1.default.findLastRound(user_id);
    }
    catch (err) {
        res.status(200).json({ ok: false, message: err.message });
    }
    res.status(200).json({ ok: true, possibilities });
}));
router.get("/user/:id/first", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    let possibilities;
    if (!user_id) {
        res.status(400).json({ ok: false, message: "/:id required" });
    }
    try {
        possibilities = yield model_1.default.findFirstRound(user_id);
    }
    catch (err) {
        res.status(200).json({ ok: false, message: err.message });
    }
    res.status(200).json({ ok: true, possibilities });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map