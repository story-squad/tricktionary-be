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
const utils_1 = require("./utils");
const router = express_1.Router();
/**
 * example req.body
 *
 * {
 *  user_id: 1,
 *  round_id: 1,
 *  reaction_id: 1,
 *  definition_id: 1,
 *  game_finished: false
 * }
 *
 */
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = utils_1.validateDefinitionReaction(req.body);
    if (result.ok) {
        // deconstruct KWARGS
        const { user_id, round_id, reaction_id, definition_id, game_finished } = result.value;
        // send as ordinal ARGS
        const drId = yield model_1.default.add(user_id, round_id, reaction_id, definition_id, game_finished);
        res.status(201).json({ added: true, drId });
    }
    else {
        res.status(400).json({ message: result.message });
    }
}));
router.get("/", (req, res) => {
    res.status(200).json({ router: "definition-reactions" });
});
router.get("/user/:id", (req, res) => {
    const userID = req.params.id;
    return model_1.default.getByUser(userID);
});
router.get("/round/:id", (req, res) => {
    const roundID = Number(req.params.id);
    return model_1.default.getByRound(roundID);
});
router.get("/reaction/:id", (req, res) => {
    const reactionID = Number(req.params.id);
    return model_1.default.getByReaction(reactionID);
});
router.get("/definition/:id", (req, res) => {
    const definitionID = Number(req.params.id);
    return model_1.default.getByDefinition(definitionID);
});
router.get("/finished", (req, res) => {
    return model_1.default.getFinished();
});
router.get("/unfinished", (req, res) => {
    return model_1.default.getUnfinished();
});
exports.default = router;
//# sourceMappingURL=routes.js.map