"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../../dbConfig"));
exports.default = {
    add,
    getByReaction,
    getByRound,
    getByDefinition,
    getByUser,
    getFinished,
    getUnfinished
};
function add(userId, roundID, reactionID, definitionID, gameFinished) {
    return (0, dbConfig_1.default)("Definition-Reactions")
        .insert({
        user_id: userId,
        round_id: roundID,
        reaction_id: reactionID,
        definition_id: definitionID,
        game_finished: gameFinished
    })
        .returning("id");
}
function getByRound(roundID) {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ round_id: roundID });
}
function getByUser(userID) {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ user_id: userID });
}
function getByReaction(reactionID) {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ reaction_id: reactionID });
}
function getByDefinition(definitionID) {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ definition_id: definitionID });
}
function getFinished() {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ game_finished: true });
}
function getUnfinished() {
    return (0, dbConfig_1.default)("Definition-Reactions").where({ game_finished: false });
}
//# sourceMappingURL=model.js.map