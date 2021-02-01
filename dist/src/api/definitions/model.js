"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const utils_1 = require("./utils");
function add(userID, definition, roundID) {
    // validate object.property types
    const newDefinition = utils_1.validateDefinition({
        user_id: userID,
        definition,
        round_id: roundID
    });
    return newDefinition.ok
        ? dbConfig_1.default("Definitions").insert(newDefinition.value).returning("id")
        : [-1, newDefinition.message];
}
exports.default = { add };
//# sourceMappingURL=model.js.map