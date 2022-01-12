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
const router = (0, express_1.Router)();
router.post("/start", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lobby, wordId, lobbyCode } = req.body;
    const result = yield model_1.default.add(lobby, wordId, lobbyCode);
    res.status(201).json({ roundId: Array.from(result).pop() });
}));
router.post("/finish", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roundId } = req.body;
    try {
        const result = yield model_1.default.roundFinished(Number(roundId));
        res.status(200).json({ result });
    }
    catch (err) {
        (0, logger_1.log)(err.message);
        res.status(400).json({ err });
    }
}));
router.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const round_id = Number(req.params.id);
    let round;
    if (!round_id) {
        res.status(400).json({ error: "id?" });
    }
    try {
        round = yield model_1.default.get(round_id);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json({ round });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map