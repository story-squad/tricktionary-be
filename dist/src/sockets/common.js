"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.newPlayerRecord = exports.gameExists = exports.whereAmI = exports.b64 = exports.startNewRound = exports.wordFromID = exports.contributeWord = exports.checkSettings = exports.sendToHost = exports.playerIsHost = exports.privateMessage = exports.fortune = exports.localAxios = exports.LC_LENGTH = void 0;
const GameSettings_1 = require("../GameSettings");
// import * as dotenv from "dotenv";
// import util from "util";
// import { exec as cmd } from "child_process";
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const localAxios = axios_1.default.create({
    baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${process.env.PORT || 5000}`
});
exports.localAxios = localAxios;
localAxios.defaults.timeout = 10000;
const LC_LENGTH = 4; // number of characters in lobbyCode
exports.LC_LENGTH = LC_LENGTH;
// const exec = util.promisify(cmd);
function fortune() {
    return __awaiter(this, void 0, void 0, function* () {
        // returns a promise
        // const { stdout, stderr } = await exec("fortune");
        // return { fortune: stdout, error: stderr };
        return { fortune: "coming soon?" };
    });
}
exports.fortune = fortune;
/**
 * send message to socket.id
 *
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param listener string
 * @param message string
 *
 * helper function; not directly exposed to the public.
 *
 * please handle all necessary authority role checks, prior to invocation.
 */
function privateMessage(io, socket, listener, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pid = socket.id;
            io.to(pid).emit(listener, message); // private message player
            console.log(`${listener} message -> ${socket.id}`);
        }
        catch (err) {
            console.log({ [listener]: message });
        }
    });
}
exports.privateMessage = privateMessage;
function sendToHost(io, socket, lobbies, category, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lobbyCode = whereAmI(socket);
            if (lobbyCode) {
                io.to(lobbies[lobbyCode].host).emit(category, message);
            }
        }
        catch (err) {
            return false;
        }
        return true;
    });
}
exports.sendToHost = sendToHost;
function playerIsHost(socket, lobbyCode, lobbies) {
    try {
        const ok = lobbies[lobbyCode].host === socket.id;
        return { ok };
    }
    catch (err) {
        return { ok: false, message: err };
    }
}
exports.playerIsHost = playerIsHost;
function checkSettings(settings) {
    let lobbySettings;
    try {
        lobbySettings = GameSettings_1.GameSettings(settings);
    }
    catch (err) {
        console.log("settings error");
        return { ok: false, message: err.message, settings };
    }
    if (!lobbySettings.ok) {
        return { ok: false, message: lobbySettings.message, settings };
    }
    return { ok: true, settings };
}
exports.checkSettings = checkSettings;
function contributeWord(word, definition, source) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("new word!");
        let newWord = { word, definition, source, id: 0 };
        // write word to user-word db table.
        try {
            const { data } = yield localAxios.post("/api/words/contribute", {
                word,
                definition,
                source
            });
            // console.log(data)
            if ((data === null || data === void 0 ? void 0 : data.id) > 0) {
                newWord.id = data.id;
            }
        }
        catch (err) {
            console.log("error contributing.");
            console.log(err);
        }
        return newWord;
    });
}
exports.contributeWord = contributeWord;
function wordFromID(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let word;
        try {
            let output = yield localAxios.get(`/api/words/id/${id}`);
            word = (_a = output === null || output === void 0 ? void 0 : output.data) === null || _a === void 0 ? void 0 : _a.word;
            if (!word.word) {
                return { ok: false, message: "wordFromID: error" };
            }
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        return { ok: true, word };
    });
}
exports.wordFromID = wordFromID;
function startNewRound(host, word, lobbies, lobbyCode, lobbySettings) {
    return __awaiter(this, void 0, void 0, function* () {
        const phase = "WRITING";
        // start a new round
        let newRound;
        let roundId;
        try {
            console.log("starting a new round...");
            newRound = yield localAxios.post("/api/round/start", {
                lobby: lobbies[lobbyCode],
                wordId: word.id,
                lobbyCode
            });
            roundId = newRound.data.roundId;
        }
        catch (err) {
            console.log("error trying to start new round!");
            return { ok: false, message: err.message };
        }
        console.log("ROUND ID:", roundId);
        const roundSettings = {
            seconds: lobbySettings.seconds,
            source: lobbySettings.source,
            filter: lobbySettings.filter
        };
        // set phasers to "WRITING" and update the game state
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { phase, word: word.word, definition: word.definition, roundId,
            roundSettings,
            host });
        // REST-ful update
        let result;
        try {
            result = yield localAxios.post("/api/user-rounds/add-players", {
                players: lobbies[lobbyCode].players,
                roundId,
                game_id: lobbies[lobbyCode].game_id
            });
        }
        catch (err) {
            return { ok: false, result, lobbies };
        }
        return { ok: true, result, lobbies };
    });
}
exports.startNewRound = startNewRound;
/**
 * @param socket (socket io)
 * @returns the lobby code attached to this socket (string).
 */
function whereAmI(socket) {
    return Array.from(socket.rooms).length > 1
        ? String(Array.from(socket.rooms)[1])
        : null;
}
exports.whereAmI = whereAmI;
// encode a string in Base64
const encode64 = (str) => Buffer.from(str, "binary").toString("base64");
// decode a string from Base64
const decode64 = (str) => Buffer.from(str, "base64").toString("binary");
const b64 = { encode: encode64, decode: decode64 };
exports.b64 = b64;
function gameExists(lobbyCode, lobbies) {
    return Object.keys(lobbies).filter((l) => l === lobbyCode).length > 0;
}
exports.gameExists = gameExists;
function newPlayerRecord(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let last_user_id = socket.id;
        let token;
        let player;
        try {
            const login = yield localAxios.post("/api/auth/new-player", {
                last_user_id
            });
            console.log(login.data);
            token = login.data.token;
            player = login.data.player;
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        return { ok: true, player, token };
    });
}
exports.newPlayerRecord = newPlayerRecord;
//# sourceMappingURL=common.js.map