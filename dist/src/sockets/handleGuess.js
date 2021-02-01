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
                            player.points++; // +1 if you voted for the provided definition.
                        }
                        else if (g.guess === player.definitionId && g.player !== player.id) {
                            player.points++; // +1 if someone else voted for your definition.
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
        // pub-sub update
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.handleArrayOfGuesses = handleArrayOfGuesses;
function handleGuess(io, socket, lobbyCode, guess, reactions, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        // prepare the object
        const vote = {
            userID: socket.id,
            definitionID: Number(guess),
            roundID: lobbies[lobbyCode].roundId
        };
        // try to POST it
        try {
            yield common_1.localAxios.post("/api/votes", vote);
        }
        catch (err) {
            console.log("error voting. (handleGuess)");
            handleErrorMessage_1.default(io, socket, err);
        }
        if (reactions && (reactions === null || reactions === void 0 ? void 0 : reactions.length) > 0) {
            // try POST'ing reactions, if they exist.
            reactions.forEach((definition) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield common_1.localAxios.post("/api/definition-reactions", {
                        user_id: socket.id,
                        round_id: lobbies[lobbyCode].roundId,
                        reaction_id: Number(definition.reaction),
                        definition_id: Number(definition.id),
                        game_finished: false
                    });
                }
                catch (err) {
                    console.log("error reacting to definition.");
                    handleErrorMessage_1.default(io, socket, err);
                }
            }));
        }
        const hostingThisRound = common_1.playerIsHost(socket, lobbyCode, lobbies).ok;
        const votesCollected = `Guesses: ${lobbies[lobbyCode].guesses.length}/${lobbies[lobbyCode].players.length}`;
        const guesses = hostingThisRound
            ? [...lobbies[lobbyCode].guesses, { player: socket.id, guess }]
            : [{ message: votesCollected }];
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { guesses });
        console.log(votesCollected);
        if (lobbies[lobbyCode].players.length === lobbies[lobbyCode].guesses.length) {
            // when all players have voted...
            const roundId = lobbies[lobbyCode].roundId;
            // RESTful update
            let newRound;
            // end this round
            try {
                newRound = yield common_1.localAxios.post("/api/round/finish", { roundId });
                if (newRound.status === 200) {
                    console.log(`* end of round ${roundId}`);
                }
            }
            catch (err) {
                console.log("error while ending round!");
                handleErrorMessage_1.default(io, socket, err);
            }
            if (hostingThisRound) {
                lobbies[lobbyCode] = calculatePoints(lobbies[lobbyCode]);
            }
            // change to next game phase.
            lobbies[lobbyCode].phase = "RESULTS";
        }
        // pub-sub update
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
function calculatePoints(lobby) {
    lobby.guesses.forEach((guess) => {
        lobby.players.forEach((player) => {
            if (guess.guess === "0" && player.id === guess.player) {
                player.points++; // +1 if you voted for the provided definition.
            }
            else if (guess.guess === player.id && guess.player !== player.id) {
                player.points++; // +1 if someone else voted for your definition.
            }
        });
    });
    return lobby;
}
exports.default = handleGuess;
//# sourceMappingURL=handleGuess.js.map