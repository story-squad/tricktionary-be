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
exports.getDatabaseReactions = void 0;
const model_1 = __importDefault(require("./model"));
const logger_1 = require("../../logger");
/**
 * seconds to live in redis cache
 */
const CACHE_LIFETIME_REACTIONS = process.env.CACHE_LIFETIME_REACTIONS
    ? Number(process.env.CACHE_LIFETIME_REACTIONS)
    : 120;
/**
 * DB table of Reactions
 * @returns Promise
 */
function getDatabaseReactions(cache) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // lookup in rdb
            const available = yield model_1.default.getAll();
            // update cache when available
            if (cache === null || cache === void 0 ? void 0 : cache.setValue) {
                const stringData = JSON.stringify({ available });
                cache.setValue("tricktionary-reactions", stringData, CACHE_LIFETIME_REACTIONS);
            }
            return { available };
        }
        catch (err) {
            logger_1.log("error whilst getting/setting tricktionary-reactions");
            return { error: err };
        }
    });
}
exports.getDatabaseReactions = getDatabaseReactions;
//# sourceMappingURL=util.js.map