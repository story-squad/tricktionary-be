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
exports.handleArrayOfGuesses = void 0;
const common_1 = require("./common");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
const logger_1 = require("../logger");
function handleArrayOfGuesses(io, socket, lobbyCode, lobbies, guesses) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobby = lobbies[lobbyCode];
        const roundId = lobby.roundId;
        const game_id = lobbies[lobbyCode].game_id;
        logger_1.log(`[calculate score] ${lobbyCode}`);
        guesses.forEach((g) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield common_1.localAxios.post("/api/votes", {
                    userID: g.player,
                    definitionID: g.guess,
                    roundID: roundId,
                });
                let pointsUpdate;
                let definitionUpdate;
                lobby.players.forEach((player) => __awaiter(this, void 0, void 0, function* () {
                    if (g.guess === 0 && player.id === g.player) {
                        player.points += common_1.VALUE_OF_TRUTH; // +1 if you voted for the provided definition.
                        // increase player score
                        pointsUpdate = yield common_1.localAxios.put(`/api/score/increase/${player.pid}`, {
                            game_id,
                            points: common_1.VALUE_OF_TRUTH,
                        });
                        logger_1.log(`+${common_1.VALUE_OF_TRUTH} player : ${player.username}`);
                        // log(pointsUpdate.data);
                    }
                    else if (g.guess === player.definitionId && g.player !== player.id) {
                        player.points += common_1.VALUE_OF_BLUFF; // +1 if someone else voted for your definition.
                        // increase player score
                        pointsUpdate = yield common_1.localAxios.put(`/api/score/increase/${player.pid}`, {
                            game_id,
                            points: common_1.VALUE_OF_BLUFF,
                        });
                        logger_1.log(`+${common_1.VALUE_OF_BLUFF} player : ${player.username}`);
                        // increase definition score
                        definitionUpdate = yield common_1.localAxios.put(`/api/definitions/increase/game/${game_id}/round/${roundId}`, {
                            player_id: player.pid,
                            points: common_1.VALUE_OF_BLUFF,
                        });
                        logger_1.log(`+${common_1.VALUE_OF_TRUTH} definition : ${player.definitionID}`);
                        // log(pointsUpdate.data);
                        // log(definitionUpdate.data);
                    }
                }));
            }
            catch (err) {
                logger_1.log(`error: handleArrayOfGuesses, ${err.message}`);
            }
        }));
        try {
            const newRound = yield common_1.localAxios.post("/api/round/finish", { roundId });
            if (newRound.status === 200) {
                logger_1.log(`* end of round ${roundId}`);
            }
        }
        catch (err) {
            logger_1.log(`error while ending round!, ${lobbyCode}`);
            handleErrorMessage_1.default(io, socket, 2003, "there was a server error while ending the round");
            return;
        }
        logger_1.log(`changing phase, ${lobbyCode} -> POSTGAME`);
        lobbies[lobbyCode].phase = "POSTGAME";
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.handleArrayOfGuesses = handleArrayOfGuesses;
//# sourceMappingURL=handleGuess.js.map