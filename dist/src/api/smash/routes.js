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
const logger_1 = require("../../logger");
const middleware_1 = require("../middleware");
const util_1 = __importDefault(require("./util"));
const model_1 = require("./model");
const router = express_1.Router();
router.put("/emoji/:lobbyCode", middleware_1.redisCache, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tc = req.redis;
    const lobbyCode = req.params.lobbyCode;
    const game_id = req.body.game_id;
    // deconstruct required fields
    const { roundId, definitionId, reactionId, value } = req.body;
    if (!lobbyCode || !game_id) {
        const details = `lobbyCode ${lobbyCode}, game_id ${game_id}`;
        logger_1.log(`[SMASH!] error: ${details}`);
        return yield res.json({ error: details });
    }
    // initialize last value
    const last = value || 0;
    // non-cache callback for postgres;
    const simpleCallback = (value) => __awaiter(void 0, void 0, void 0, function* () { return res.json({ value }); });
    // create a callback to return the result
    const keyName = `${model_1.cacheGroupName}${game_id}-${roundId}-${definitionId}-${reactionId}`;
    const tcCallback = (tc === null || tc === void 0 ? void 0 : tc.createCallback(keyName, (value) => __awaiter(void 0, void 0, void 0, function* () { return res.json({ value }); }))) ||
        simpleCallback;
    // call asynchronous update function
    return yield util_1.default(tc, game_id, roundId, definitionId, reactionId, tcCallback, last);
}));
router.get("/totals/:game_id/:round_id", middleware_1.redisCache, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tc = req.redis;
    const game_id = req.params.game_id;
    const round_id = req.params.round_id;
    if (!tc) {
        // return the results from the RDB
        try {
            const totals = yield model_1.getTotals(game_id, round_id);
            return yield res.status(200).json(totals);
        }
        catch (err) {
            return yield res.status(400).json({ error: err.message });
        }
    }
    // const { game_id, round_id } = req.body;
    // search key-names from the cache that match this pattern,
    const pattern = `${model_1.cacheGroupName}${game_id}-${round_id}*`;
    // collect them in this queue
    const result = { queue: [] };
    function updateFinal(keyName, value, total) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = Number(value);
            if (check === NaN || check <= 0) {
                logger_1.log("[ERROR] non-numeric value");
            }
            let parseKey = keyName.split("-");
            const reaction_id = Number(parseKey.pop()); // thats numberwang
            const definition_id = Number(parseKey.pop()); // thats numberwang
            const round_id = Number(parseKey.pop()); // thats numberwang
            const game_id = parseKey.join("-").slice(model_1.cacheGroupName.length);
            result.queue.push({
                game_id,
                round_id,
                definition_id,
                reaction_id,
                value,
            });
            if (result.queue.length === total) {
                // lets rotate the board!
                yield model_1.bulkUpdate(result.queue, (value) => __awaiter(this, void 0, void 0, function* () { return res.json(value); }));
            }
        });
    }
    const tcCallback = tc === null || tc === void 0 ? void 0 : tc.createCallback(pattern, (keys) => __awaiter(void 0, void 0, void 0, function* () {
        const totalKeys = keys.length;
        keys.forEach((keyName) => tc.getValue(keyName, tc === null || tc === void 0 ? void 0 : tc.createCallback(keyName, (value) => updateFinal(keyName, Number(value), totalKeys))));
    }));
    try {
        yield (tc === null || tc === void 0 ? void 0 : tc.findKeys(pattern, tcCallback));
    }
    catch (err) {
        res.json({ error: err });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map