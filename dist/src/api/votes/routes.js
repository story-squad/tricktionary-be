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
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vote = req.body;
    const userID = vote === null || vote === void 0 ? void 0 : vote.userID;
    const definitionID = vote === null || vote === void 0 ? void 0 : vote.definitionID;
    const roundID = vote === null || vote === void 0 ? void 0 : vote.roundID;
    try {
        const result = yield model_1.default.add(userID, definitionID, roundID);
        res.status(200).json({ ok: true, voteID: result });
    }
    catch (err) {
        res.status(200).json({ ok: false, error: err });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map