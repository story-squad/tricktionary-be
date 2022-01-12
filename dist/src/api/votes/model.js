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
exports.add = void 0;
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const utils_1 = require("./utils");
const logger_1 = require("../../logger");
function add(userID, definitionID, roundID) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, utils_1.validateVote)({
            user_id: userID,
            definition_id: definitionID === 0 ? null : definitionID,
            round_id: roundID,
        });
        if (!result.ok) {
            return (0, logger_1.log)(result.message);
        }
        const [voteId] = yield (0, dbConfig_1.default)("Votes").insert(result.value).returning("id");
        return voteId;
    });
}
exports.add = add;
exports.default = { add };
//# sourceMappingURL=model.js.map