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
exports.smashUpdate = void 0;
const model_1 = require("./model");
const logger_1 = require("../../logger");
/**
 * Returns true when all numbers are greater than zero
 * @param arr Array of numbers
 * @returns boolean
 */
function gtZero(arr) {
    return arr.map((n) => n > 0).reduce((a, b) => (b === a) === true);
}
function pgUpdate(game_id, round_id, definition_id, reaction_id, callBack) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        let value = 0;
        logger_1.log(`PG: ${game_id}, ${round_id}, ${definition_id}, ${reaction_id}`);
        const oldValue = yield model_1.get(game_id, round_id, definition_id, reaction_id);
        if (!(oldValue === null || oldValue === void 0 ? void 0 : oldValue.id)) {
            try {
                // add
                result = yield model_1.add(game_id, round_id, definition_id, reaction_id);
                value = result[0] || 0;
            }
            catch (err) {
                return { error: err };
            }
        }
        else {
            try {
                // increment
                result = yield model_1.incr(game_id, round_id, definition_id, reaction_id);
                value = result[0] || result;
            }
            catch (err) {
                // database error ?
                return { error: err };
            }
        }
        return yield callBack(value);
    });
}
/**
 * https://redis.io/commands/incr
 * @returns Promise<number>
 */
function smashUpdate(mem, game_id, round_id, definition_id, reaction_id, callBack, last) {
    return __awaiter(this, void 0, void 0, function* () {
        // create a unique string keyname
        const keyName = `${model_1.cacheGroupName}${game_id}-${round_id}-${definition_id}-${reaction_id}`;
        // no TricktionaryCache ?
        if (!(mem === null || mem === void 0 ? void 0 : mem.incValue)) {
            logger_1.log("no cache update");
            try {
                // update the postgres database
                return yield pgUpdate(game_id, round_id, definition_id, reaction_id, callBack);
                // const value = await pgUpdate(keyName);
                // return await callBack(value);
            }
            catch (err) {
                logger_1.log(err);
                return;
            }
        }
        // TricktionaryCache ?
        const defaultValue = last || 0;
        try {
            // cache update
            return yield (mem === null || mem === void 0 ? void 0 : mem.incValue(keyName, callBack));
        }
        catch (err) {
            return yield callBack(defaultValue + 1);
        }
    });
}
exports.smashUpdate = smashUpdate;
exports.default = smashUpdate;
//# sourceMappingURL=util.js.map