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
exports.getTotals = exports.cacheGroupName = exports.bulkUpdate = exports.updateCount = exports.incr = exports.get = exports.add = void 0;
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const logger_1 = require("../../logger");
const cacheGroupName = "SMASHED";
exports.cacheGroupName = cacheGroupName;
function add(game_id, round_id, definition_id, reaction_id, value) {
    return dbConfig_1.default("Smash")
        .insert({
        game_id,
        round_id,
        definition_id,
        reaction_id,
        count: value || 1
    })
        .returning("count");
}
exports.add = add;
function get(game_id, round_id, definition_id, reaction_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dbConfig_1.default("Smash")
            .where({
            game_id,
            round_id,
            definition_id,
            reaction_id
        })
            .returning("count").first();
    });
}
exports.get = get;
function incr(game_id, round_id, definition_id, reaction_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dbConfig_1.default("Smash")
            .where({
            game_id,
            round_id,
            definition_id,
            reaction_id
        })
            .increment("count")
            .returning("count");
    });
}
exports.incr = incr;
function updateCount(game_id, round_id, definition_id, reaction_id, count) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbConfig_1.default("Smash")
            .where({
            game_id,
            round_id,
            definition_id,
            reaction_id
        })
            .first()
            .update({ count })
            .returning("count").first();
    });
}
exports.updateCount = updateCount;
/**
 * update these records in the RDB where necessary,
 *
 * @param arr array of Smash records
 * @param cb callback function
 * @returns the list of records, unmodified
 */
function bulkUpdate(arr, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            arr.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                const { game_id, round_id, definition_id, reaction_id, value } = item;
                // check the database for an existing record
                const result = yield dbConfig_1.default("Smash")
                    .where({
                    game_id,
                    round_id,
                    definition_id,
                    reaction_id
                })
                    .first();
                if (!((result === null || result === void 0 ? void 0 : result.id) && (result === null || result === void 0 ? void 0 : result.count))) {
                    yield add(game_id, round_id, definition_id, reaction_id, value);
                }
                else {
                    if (value > (result === null || result === void 0 ? void 0 : result.count)) {
                        yield dbConfig_1.default("Smash").where({ id: result.id }).update({ count: value });
                    }
                }
            }));
        }
        catch (err) {
            logger_1.log(err.message);
        }
        return yield cb(arr);
    });
}
exports.bulkUpdate = bulkUpdate;
function getTotals(game_id, round_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dbConfig_1.default("Smash").where({
            game_id,
            round_id
        });
    });
}
exports.getTotals = getTotals;
//# sourceMappingURL=model.js.map