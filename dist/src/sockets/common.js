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
exports.gameExists = exports.updatePlayerToken = exports.whereAmI = exports.b64 = exports.startNewRound = exports.wordFromID = exports.contributeWord = exports.checkSettings = exports.sendToHost = exports.playerIdWasHost = exports.playerIsHost = exports.privateMessage = exports.localAxios = exports.LC_LENGTH = exports.VALUE_OF_TRUTH = exports.VALUE_OF_BLUFF = exports.MAX_PLAYERS = void 0;
const GameSettings_1 = require("../GameSettings");
const logger_1 = require("../logger");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const localAxios = axios_1.default.create({
    baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${process.env.PORT || 5000}`,
});
exports.localAxios = localAxios;
localAxios.defaults.timeout = 10000;
/**
 * maximum number of players per lobby
 */
const MAX_PLAYERS = process.env.MAX_PLAYERS || 30;
exports.MAX_PLAYERS = MAX_PLAYERS;
/**
 * Number of characters in lobbyCode
 */
const LC_LENGTH = process.env.LC_LENGTH
    ? Number(process.env.LC_LENGTH)
    : 4;
exports.LC_LENGTH = LC_LENGTH;
/**
 * POINTS AWARDED when you choose correctly
 */
const VALUE_OF_TRUTH = process.env.VALUE_OF_TRUTH
    ? Number(process.env.VALUE_OF_TRUTH)
    : 2;
exports.VALUE_OF_TRUTH = VALUE_OF_TRUTH;
/**
 * POINTS AWARDED when others choose your definition
 */
const VALUE_OF_BLUFF = process.env.VALUE_OF_BLUFF
    ? Number(process.env.VALUE_OF_BLUFF)
    : 1;
exports.VALUE_OF_BLUFF = VALUE_OF_BLUFF;
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
            logger_1.log(`${listener} message -> ${socket.id}`);
        }
        catch (err) {
            logger_1.log(`${listener}: ${message}`);
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
function playerIdWasHost(playerId, lobbyCode, lobbies) {
    try {
        const ok = lobbies[lobbyCode].host === playerId;
        return { ok };
    }
    catch (err) {
        return { ok: false, message: err };
    }
}
exports.playerIdWasHost = playerIdWasHost;
function checkSettings(settings) {
    let lobbySettings;
    try {
        lobbySettings = GameSettings_1.GameSettings(settings);
    }
    catch (err) {
        logger_1.log("settings error");
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
        logger_1.log("new word!");
        let newWord = { word, definition, source, id: 0 };
        // write word to user-word db table.
        try {
            const { data } = yield localAxios.post("/api/words/contribute", {
                word,
                definition,
                source,
            });
            // log(data)
            if ((data === null || data === void 0 ? void 0 : data.id) > 0) {
                newWord.id = data.id;
            }
        }
        catch (err) {
            logger_1.log("error contributing.");
            logger_1.log(err);
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
            logger_1.log("starting a new round...");
            newRound = yield localAxios.post("/api/round/start", {
                lobby: lobbies[lobbyCode],
                wordId: word.id,
                lobbyCode,
            });
            roundId = newRound.data.roundId;
            logger_1.log("ROUND ID: " + roundId);
        }
        catch (err) {
            logger_1.log("error trying to start new round!");
            return { ok: false, message: err.message };
        }
        const roundSettings = {
            seconds: lobbySettings.seconds,
            source: lobbySettings.source,
            filter: lobbySettings.filter,
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
                game_id: lobbies[lobbyCode].game_id,
            });
        }
        catch (err) {
            return { ok: false, result, lobbies };
        }
        return { ok: true, result, lobbies, roundId };
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
/**
 * encode a string in Base64
 * @param str string
 */
const encode64 = (str) => Buffer.from(str, "binary").toString("base64");
/**
 * decode a string from Base64
 * @param str string
 */
const decode64 = (str) => Buffer.from(str, "base64").toString("binary");
/**
 * Base64 string operatoins
 */
const b64 = { encode: encode64, decode: decode64 };
exports.b64 = b64;
/**
 * returns true if LobbyCode can be found in Lobbies
 *
 * @param lobbyCode LobbyCode of game
 * @param lobbies socket-handler games
 */
function gameExists(lobbyCode, lobbies) {
    return Object.keys(lobbies).filter((l) => l === lobbyCode).length > 0;
}
exports.gameExists = gameExists;
/**
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param p_id Player UUID
 * @param name Player's username
 * @param definition Player's definition
 * @param points Player's points
 * @param lobbyCode Players current game code
 */
function updatePlayerToken(io, socket, p_id, name, definition, points, lobbyCode, info) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        try {
            // update the HOST's token with lobbyCode
            const payload = {
                s_id: socket.id,
                p_id,
                name,
                definition: definition || "",
                points: points || 0,
                lobbyCode,
            };
            const { data } = yield localAxios.post("/api/auth/update-token", payload);
            if (data.ok) {
                // send token to player
                io.to(socket.id, "token update", data.token, info);
                // update the database
                token = data.token;
                yield localAxios.put(`/api/player/id/${p_id}`, {
                    token,
                    last_played: lobbyCode,
                });
            }
            else {
                logger_1.log(data.message);
                return data;
            }
        }
        catch (err) {
            logger_1.log(err.message);
            return { ok: false, message: err.message };
        }
        return { ok: true, token };
    });
}
exports.updatePlayerToken = updatePlayerToken;
//# sourceMappingURL=common.js.map