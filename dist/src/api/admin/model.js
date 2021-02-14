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
exports.default = {
    getRound,
    getPassoversForWord,
    getDefinitionDetails,
};
/**
 * Round round get around, I get around, yeah
 * (Get around round round I get around, ooh-ooh) I get around
 * From town to town (get around round round I get around)
 * I'm a real cool head (get around round round I get around)
 * I'm makin' real good bread (get around round round I get around)
 * @param roundId number
 */
function getRound(roundId) {
    return __awaiter(this, void 0, void 0, function* () {
        const definitions = yield dbConfig_1.default("Definitions").where({ round_id: roundId });
        const definitionReactions = yield dbConfig_1.default("Definition-Reactions").where({
            round_id: roundId,
        });
        // I'm gettin' bugged driving up and down the same old strip
        // I gotta find a new place where the kids are hip
        const players = yield dbConfig_1.default("User-Rounds").where({ round_id: roundId });
        // My buddies and me are getting real well known
        // Yeah, the bad guys know us and they leave us alone
        const votes = yield dbConfig_1.default("Votes").where({ round_id: roundId });
        // I get around (get around round round I get around)
        const round = yield dbConfig_1.default("Rounds").where({ id: roundId }).first();
        // From town to town (get around round round I get around)
        const word = yield dbConfig_1.default("Words").where({ id: round.word_id }).first();
        // I'm a real cool head (get around round round I get around)
        // I'm makin' real good bread (get around round round I get around)
        const choices = yield dbConfig_1.default("host-choices")
            .where({ round_id: roundId })
            .first();
        return {
            word,
            round,
            players,
            definitions,
            definitionReactions,
            votes,
            choices,
        };
    });
}
function getPassoversForWord(word_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let choices_with_word = [];
        const choices_one = yield dbConfig_1.default("host-choices").where({
            word_id_one: word_id,
        });
        const choices_two = yield dbConfig_1.default("host-choices").where({
            word_id_two: word_id,
        });
        choices_with_word = [...choices_one, ...choices_two];
        return choices_with_word;
    });
}
function getDefinitionDetails(definition_id) {
    return __awaiter(this, void 0, void 0, function* () {
        //get definition by id
        const definition = yield dbConfig_1.default("Definitions").where({ definition_id });
        //get all votes by definition id
        const votes = yield dbConfig_1.default("Votes").where({ definition_id });
        //get num of players from round
        const round = yield dbConfig_1.default("Rounds")
            .where({ id: definition.round_id })
            .first();
        //get any reactions from the join table
        const reactions = yield dbConfig_1.default("Definition-Reactions").where({
            definition_id,
        });
        return {
            definition: definition,
            votes: votes,
            num_players: round.number_players,
            reactions: reactions,
        };
    });
}
//# sourceMappingURL=model.js.map