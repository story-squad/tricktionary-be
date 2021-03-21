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
function handleStartGame(io, socket, lobbyCode, lobbies, settings, hostChoice) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const defaultError = "there was an error with starting your game";
        let r = common_1.checkSettings(settings);
        if (!r.ok) {
            handleErrorMessage_1.default(io, socket, 2006, defaultError);
            return;
        }
        let { word, source } = r.settings;
        if (word.id === 0) {
            try {
                word = yield common_1.contributeWord(word.word, word.definition, source);
            }
            catch (err) {
                logger_1.log(`[!ERROR] handleStartGame -> contributeWord(${word.word}, ${word.definition}, ${source})`);
                handleErrorMessage_1.default(io, socket, 2006, defaultError);
                return;
            }
        }
        else {
            let r = yield common_1.wordFromID(word.id);
            if (r.ok) {
                word = r.word;
            }
        }
        let newRound;
        try {
            newRound = yield common_1.startNewRound(socket.id, word, lobbies, lobbyCode, r.settings);
        }
        catch (err) {
            logger_1.log(`[!ERROR] handleStartGame -> startNewRound by ${socket.id} with "${word.word}" from ${source}`);
            handleErrorMessage_1.default(io, socket, 2006, defaultError);
            return;
        }
        if (newRound.ok && ((_a = newRound.result) === null || _a === void 0 ? void 0 : _a.status) === 201) {
            lobbies = newRound.lobbies;
            // update the host token
            try {
                yield common_1.localAxios.post("/api/choice", Object.assign(Object.assign({}, hostChoice), { round_id: newRound.roundId }));
            }
            catch (err) {
                logger_1.log("error recording the host's choices");
                logger_1.log(err.message);
                handleErrorMessage_1.default(io, socket, 2006, defaultError);
                return;
            }
            // pub-sub update
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            logger_1.log("there was a server error while starting the game");
            handleErrorMessage_1.default(io, socket, 2006, defaultError);
        }
    });
}
exports.default = handleStartGame;
//# sourceMappingURL=handleStartGame.js.map