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
function handleStartGame(io, socket, lobbyCode, lobbies, settings) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let r = common_1.checkSettings(settings);
        if (!r.ok) {
            handleErrorMessage_1.default(io, socket, r === null || r === void 0 ? void 0 : r.message);
            return;
        }
        console.log(r.settings);
        let { word, source } = r.settings;
        if (word.id === 0) {
            word = yield common_1.contributeWord(word.word, word.definition, source);
        }
        else {
            let r = yield common_1.wordFromID(word.id);
            if (r.ok) {
                word = r.word;
            }
        }
        let newRound = yield common_1.startNewRound(socket.id, word, lobbies, lobbyCode, r.settings);
        if (newRound.ok && ((_a = newRound.result) === null || _a === void 0 ? void 0 : _a.status) === 201) {
            lobbies = newRound.lobbies;
            // update the host token
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