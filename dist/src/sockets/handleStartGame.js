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
const GameSettings_1 = require("../GameSettings");
function handleStartGame(io, socket, lobbyCode, lobbies, settings) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let lobbySettings;
        try {
            lobbySettings = GameSettings_1.GameSettings(settings);
        }
        catch (err) {
            console.log("settings error");
            handleErrorMessage_1.default(io, socket, err);
            return;
        }
        if (!lobbySettings.ok) {
            handleErrorMessage_1.default(io, socket, lobbySettings.message);
            return;
        }
        // lobbySettings are now verified.
        console.log(`timer set to ${lobbySettings.value.seconds}`);
        let { word } = lobbySettings.value;
        const { source } = lobbySettings.value;
        if (word.id === 0) {
            console.log("new word!");
            // write word to user-word db table.
            try {
                const { data } = yield common_1.localAxios.post("/api/words/contribute", {
                    word: word.word,
                    definition: word.definition,
                    source
                });
                // console.log(data)
                if ((data === null || data === void 0 ? void 0 : data.id) > 0) {
                    word.id = data.id;
                }
            }
            catch (err) {
                console.log("error contributing.");
                console.log(err);
            }
        }
        else {
            console.log(`word from ${lobbySettings.value.source}`);
            // begin get word from source
            let output;
            // let word:string;
            try {
                // get word by id
                output = yield common_1.localAxios.get(`/api/words/id/${word.id}`);
                word = (_a = output === null || output === void 0 ? void 0 : output.data) === null || _a === void 0 ? void 0 : _a.word;
                if (!word.word) {
                    handleErrorMessage_1.default(io, socket, `error requesting word with id ${word.id} from ${lobbySettings.value.source}`);
                    return;
                }
            }
            catch (err) {
                console.log(err.message);
                handleErrorMessage_1.default(io, socket, err.message);
                return;
            }
            // end get word from source
        }
        const phase = "WRITING";
        // start a new round
        let newRound;
        let roundId;
        try {
            console.log("starting a new round...");
            newRound = yield common_1.localAxios.post("/api/round/start", {
                lobby: lobbies[lobbyCode],
                wordId: word.id
            });
            roundId = (_b = newRound.data) === null || _b === void 0 ? void 0 : _b.roundId;
        }
        catch (err) {
            console.log("error trying to start new round!");
            handleErrorMessage_1.default(io, socket, err);
        }
        console.log("ROUND ID:", roundId);
        const roundSettings = {
            seconds: lobbySettings.value.seconds,
            source: lobbySettings.value.source,
            filter: lobbySettings.value.filter
        };
        // set phasers to "WRITING" and update the game state
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { phase, word: word.word, definition: word.definition, roundId,
            roundSettings, host: socket.id });
        // REST-ful update
        let result;
        try {
            result = yield common_1.localAxios.post("/api/user-rounds/add-players", {
                players: lobbies[lobbyCode].players,
                roundId
            });
        }
        catch (err) {
            console.log("error: handleStartGame:55");
            handleErrorMessage_1.default(io, socket, err);
        }
        if ((result === null || result === void 0 ? void 0 : result.status) === 201) {
            // pub-sub update
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            console.log("error updating game");
        }
    });
}
exports.default = handleStartGame;
//# sourceMappingURL=handleStartGame.js.map