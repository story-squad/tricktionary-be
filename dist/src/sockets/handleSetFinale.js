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
const common_1 = require("./common");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
const logger_1 = require("../logger");
/**
 *
 * Allows the host to store and retrieve
 *
 * 1) three top scoring users
 * 2) these users' top-three definitions for the whole game (from any round)
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 */
function handleSetFinale(io, socket, lobbyCode, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const present = lobbyCode && common_1.whereAmI(socket) === lobbyCode;
        if (!present) {
            handleErrorMessage_1.default(io, socket, 2004, "You're not in the lobby");
        }
        const authorized = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (!authorized.ok) {
            handleErrorMessage_1.default(io, socket, 2005, "You're not the host and can not end the game");
        }
        const game_id = lobbies[lobbyCode].game_id;
        const finaleTime = Date.now();
        /**
         * extra points, for submitting early, are used to determine leaderboard stats
         */
        const withEpochPoints = lobbies[lobbyCode].players.map((p) => {
            /**
             * 1 + the difference between now and when the player submitted their definition
             *
             * *or*
             *
             * a random number between 0 and 2
             */
            const timeDelta = p.definitionEpoch
                ? Math.ceil((finaleTime - p.definitionEpoch) / 1000) + 1
                : Math.random() * 2;
            /**
             * player points + timeDelta
             */
            const points = p.points + timeDelta;
            return Object.assign(Object.assign({}, p), { points });
        });
        const topThree = withEpochPoints
            .sort(function (a, b) {
            return b.points - a.points;
        })
            .slice(0, 3);
        // 1) assign the resulting player(s) to constant placeholder values,
        const firstPlace = topThree[0];
        const secondPlace = topThree[1] || undefined;
        const thirdPlace = topThree[2] || undefined;
        // 2) await, at the top level, the result of asynchronous operations
        let mostVotedRound;
        let mvd;
        const results = [];
        function finalFormat(defRecord) {
            const { user_id, definition, def_word } = defRecord;
            const { word } = def_word;
            return { user_id, definition, word };
        }
        function getDef(user_id, game_id, player_id) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let result = { id: user_id, game: game_id };
                let mvr;
                let mvd;
                let r;
                let wid;
                let rWord;
                let def_word;
                let updateScoreCard;
                try {
                    let p = yield common_1.localAxios.get(`/api/user-rounds/user/${result.id}/game/${result.game}`);
                    result["user_rounds"] = p.data.user_rounds;
                    // most voted round
                    mvr = result.user_rounds.sort(function (a, b) {
                        return b.votes - a.votes;
                    })[0].round_id;
                    // most voted definition
                    mvd = yield common_1.localAxios.get(`/api/definitions/user/${result.id}/round/${mvr}`);
                    if ((_a = mvd === null || mvd === void 0 ? void 0 : mvd.data) === null || _a === void 0 ? void 0 : _a.id) {
                        updateScoreCard = yield common_1.localAxios.put(`/api/score/def/${player_id}`, {
                            game_id,
                            top_definition_id: mvd.data.id,
                        });
                    }
                    r = yield common_1.localAxios.get(`/api/round/id/${mvr}`);
                    wid = r.data.round.word_id;
                    rWord = yield common_1.localAxios.get(`/api/words/id/${wid}`);
                    def_word = rWord.data.word;
                }
                catch (err) {
                    logger_1.log(err.message);
                    return;
                }
                return finalFormat(Object.assign(Object.assign({}, mvd.data.definition), { user_id, def_word }));
            });
        }
        // get most voted definition(s)
        try {
            const firstPlaceResult = yield getDef(firstPlace.id, game_id, firstPlace.pid);
            results.push(Object.assign({}, firstPlaceResult));
        }
        catch (err) {
            logger_1.log("error getting 1st place");
            logger_1.log(err.message);
        }
        if (secondPlace) {
            try {
                const secondPlaceResult = yield getDef(secondPlace.id, game_id, secondPlace.pid);
                results.push(Object.assign({}, secondPlaceResult));
            }
            catch (err) {
                logger_1.log("error getting second place");
                logger_1.log(err.message);
            }
        }
        if (thirdPlace) {
            try {
                const thirdPlaceResult = yield getDef(thirdPlace.id, game_id, thirdPlace.pid);
                results.push(Object.assign({}, thirdPlaceResult));
            }
            catch (err) {
                logger_1.log("error getting third place");
                logger_1.log(err.message);
            }
        }
        // add results to game-data & change phase
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { topThree: results, phase: "FINALE" });
        // update players
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
    });
}
exports.default = handleSetFinale;
//# sourceMappingURL=handleSetFinale.js.map