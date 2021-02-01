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
const utils_1 = require("../words/utils");
const express_1 = require("express");
const model_1 = __importDefault(require("./model"));
const router = express_1.Router();
router.get("/", (req, res) => {
    res.status(200).json({ ok: true, message: "administrative routes" });
});
/**
 * GET /round/:id
 * (Round round)
 * I get a round
 */
router.get("/round/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roundId = req.params.id;
    if (utils_1.validNumber(roundId)) {
        try {
            const result = yield model_1.default.getRound(Number(roundId)); // We always take my car 'cause it's never been beat
            res.status(200).json(result); // And we've never missed yet with the girls we meet
        }
        catch (err) { // None of the guys go steady 'cause it wouldn't be right
            res.status(400).json({ error: err }); // To leave their best girl home now on Saturday night
        }
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map