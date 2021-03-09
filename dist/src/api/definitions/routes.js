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
    const { playerId, definition, roundId } = req.body;
    let result;
    let defId = -1;
    try {
        result = yield model_1.default.add(playerId, definition, roundId);
        defId = result.pop();
    }
    catch (err) {
        console.log("error! definitions router");
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
    try {
        // player's definition this round
        definition = yield model_1.default.byUserInRound(user_id, round_id);
    }
    catch (err) {
        // a blank definition object
        definition = {
            user_id,
            round_id,
            definition: ""
        };
    }
    res.status(200).json({
        user_id,
        round_id,
        definition
    });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map