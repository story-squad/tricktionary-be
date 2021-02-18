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
function handleArrayOfGuesses(io, socket, lobbyCode, lobbies, guesses) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobby = lobbies[lobbyCode];
        const roundId = lobby.roundId;
        console.log('vote & calculate scores');
        guesses.forEach((g) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.localAxios.post("/api/votes", {
                    userID: g.player,
                    definitionID: g.guess,
                    roundID: roundId
                })
                    .then(() => {
                    lobby.players.forEach((player) => {
                        if (g.guess === 0 && player.id === g.player) {
                            player.points += common_1.VALUE_OF_TRUTH; // +1 if you voted for the provided definition.
                        }
                        else if (g.guess === player.definitionId && g.player !== player.id) {
                            player.points += common_1.VALUE_OF_BLUFF; // +1 if someone else voted for your definition.
                        }
                    });
                });
            }
            catch (err) {
                console.log("error: handleArrayOfGuesses, ${err}");
            }
        }));
        try {
            const newRound = yield common_1.localAxios.post("/api/round/finish", { roundId });
            if (newRound.status === 200) {
                console.log(`* end of round ${roundId}`);
            }
        }
        catch (err) {
            console.log("error while ending round!");
            handleErrorMessage_1.default(io, socket, err);
            return;
        }
        console.log('changing phase');
        lobbies[lobbyCode].phase = "RESULTS";
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.handleArrayOfGuesses = handleArrayOfGuesses;
//# sourceMappingURL=handleGuess.js.map