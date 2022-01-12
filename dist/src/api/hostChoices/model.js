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
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const utils_1 = require("./utils");
exports.default = { addHostChoice, getHostChoiceById };
function addHostChoice(word_id_one, word_id_two, round_id, times_shuffled) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate object.property types
        const newHostChoice = (0, utils_1.validateHostChoice)({
            word_id_one,
            word_id_two,
            round_id,
            times_shuffled,
        });
        return newHostChoice.ok
            ? (0, dbConfig_1.default)("host-choices").insert(newHostChoice.value).returning("id")
            : [-1, newHostChoice.message];
    });
}
function getHostChoiceById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, dbConfig_1.default)("host-choices").where({ id }).first();
    });
}
//# sourceMappingURL=model.js.map