"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./words/routes"));
const routes_2 = __importDefault(require("./reactions/routes"));
const routes_3 = __importDefault(require("./definitionReactions/routes"));
const routes_4 = __importDefault(require("./votes/routes"));
const routes_5 = __importDefault(require("./rounds/routes"));
const routes_6 = __importDefault(require("./userRounds/routes"));
const routes_7 = __importDefault(require("./definitions/routes"));
const routes_8 = __importDefault(require("./admin/routes"));
const routes_9 = __importDefault(require("./auth/routes"));
const routes_10 = __importDefault(require("./player/routes"));
const routes_11 = __importDefault(require("./bots/routes"));
const routes_12 = __importDefault(require("./game/routes"));
const routes_13 = __importDefault(require("./score/routes"));
const routes_14 = __importDefault(require("./hostChoices/routes"));
const routes_15 = __importDefault(require("./payment/routes"));
const routes_16 = __importDefault(require("./member/routes"));
const routes_17 = __importDefault(require("./smash/routes"));
exports.default = {
    word: routes_1.default,
    reaction: routes_2.default,
    definitionReaction: routes_3.default,
    vote: routes_4.default,
    round: routes_5.default,
    userRound: routes_6.default,
    definitions: routes_7.default,
    admin: routes_8.default,
    auth: routes_9.default,
    player: routes_10.default,
    bots: routes_11.default,
    game: routes_12.default,
    score: routes_13.default,
    choice: routes_14.default,
    payment: routes_15.default,
    member: routes_16.default,
    smash: routes_17.default,
};
//# sourceMappingURL=index.js.map