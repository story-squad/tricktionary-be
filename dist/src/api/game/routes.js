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
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { og_host } = req.body;
    let game_id;
    try {
        if (og_host) {
            game_id = yield model_1.default.add(og_host);
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
    res.status(200).json(game_id);
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield model_1.default.get();
    }
    catch (err) {
        result = { error: err.message };
    }
    return res.status(200).json(result.games);
}));
router.get("/latest/:limit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let limit = req.params.limit;
    const n = Number(limit) > 0 ? Number(limit) : 5;
    let result;
    try {
        result = yield model_1.default.latest(n);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(200).json(result);
}));
exports.default = router;
//# sourceMappingURL=routes.js.map