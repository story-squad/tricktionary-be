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
exports.gameExists = exports.tieBreakerMatch = exports.doIt = exports.getDef = exports.updatePlayerToken = exports.whereAmI = exports.b64 = exports.startNewRound = exports.wordFromID = exports.contributeWord = exports.checkSettings = exports.sendToHost = exports.playerIdWasHost = exports.playerIsHost = exports.privateMessage = exports.localAxios = exports.LC_LENGTH = exports.VALUE_OF_TRUTH = exports.VALUE_OF_BLUFF = exports.MAX_PLAYERS = void 0;
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
function getDef(user_id, definitionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let r;
        let rWord;
        try {
            const mvd = yield localAxios.get(`/api/definitions/id/${definitionId}`);
            const round_id = mvd.data.definition.round_id;
            const definition = mvd.data.definition.definition;
            r = yield localAxios.get(`/api/round/id/${round_id}`);
            rWord = yield localAxios.get(`/api/words/id/${r.data.round.word_id}`);
            const { word } = rWord.data.word;
            const result = { user_id, definition, word };
            return result;
        }
        catch (err) {
            logger_1.log(err.message);
            return;
        }
    });
}
exports.getDef = getDef;
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
function checkScores(lobbyCode, lobbies) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const players = (_a = lobbies[lobbyCode]) === null || _a === void 0 ? void 0 : _a.players;
        const game_id = lobbies[lobbyCode].game_id;
        if (!players) {
            logger_1.log(`[!ERROR] no players in ${lobbyCode}`);
            return { ok: false, error: `invalid lobby @ ${lobbyCode}` };
        }
        // add host to list
        logger_1.log(`updating score-cards for players in ${lobbyCode}`);
        return yield [...players, {}].forEach((playerObj) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const { username, pid } = playerObj;
            const pathname = `/api/score/player/${pid}/game/${game_id}`;
            let score = yield localAxios.get(pathname);
            if (!score.data.id) {
                logger_1.log(`creating score card for ${username}`);
                score = yield localAxios.post("/api/score/new", {
                    game_id,
                    player_id: pid,
                });
                logger_1.log(`created score card ${(_b = score.data) === null || _b === void 0 ? void 0 : _b.id} for ${username}`);
            }
            else {
                logger_1.log(`found score card ${score.data.id}, for ${username}`);
                // todo
            }
        }));
    });
}
function startNewRound(host, word, lobbies, lobbyCode, lobbySettings) {
    return __awaiter(this, void 0, void 0, function* () {
        const phase = "WRITING";
        // start a new round
        let newRound;
        let roundId;
        // make sure every player has a score-card for this game.
        yield checkScores(lobbyCode, lobbies);
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
                io.to(socket.id).emit("token update", data.token, info);
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
function doIt(game_id, firstPlace, secondPlace, thirdPlace) {
    return __awaiter(this, void 0, void 0, function* () {
        let r = [];
        // get most voted definition(s)
        try {
            const firstPlaceResult = yield getDef(firstPlace.id, // socket.id
            firstPlace.definitionId);
            r = [Object.assign({}, firstPlaceResult)];
        }
        catch (err) {
            logger_1.log("error getting 1st place");
            logger_1.log(err.message);
        }
        if (secondPlace) {
            try {
                const secondPlaceResult = yield getDef(secondPlace.id, secondPlace.definitionId);
                r = [...r, Object.assign({}, secondPlaceResult)];
            }
            catch (err) {
                logger_1.log("error getting second place");
                logger_1.log(err.message);
            }
        }
        if (thirdPlace) {
            try {
                const thirdPlaceResult = yield getDef(thirdPlace.id, thirdPlace.definitionId);
                r = [...r, Object.assign({}, thirdPlaceResult)];
            }
            catch (err) {
                logger_1.log("error getting third place");
                logger_1.log(err.message);
            }
        }
        return r;
    });
}
exports.doIt = doIt;
function tieBreakerMatch(checkPoints, game_id, lobbies, lobbyCode) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.log("tie-breaker necessary");
        // create 3 placeholders
        let firstPlace;
        let thirdPlace;
        let tiebreaker;
        if (checkPoints[0].points !== checkPoints[1].points) {
            // A. is firstplace unique?
            firstPlace = lobbies[lobbyCode].players
                .filter((p) => p.pid === checkPoints[0].player_id)
                .pop();
            logger_1.log("- tied for second place");
            tiebreaker = [checkPoints[1], checkPoints[2]];
        }
        if (!firstPlace && checkPoints[1].points !== ((_a = checkPoints[2]) === null || _a === void 0 ? void 0 : _a.points)) {
            // B. is third place unique?
            logger_1.log("- tied for first place");
            tiebreaker = [checkPoints[0], checkPoints[1]];
            if ((_b = checkPoints[2]) === null || _b === void 0 ? void 0 : _b.player_id) {
                thirdPlace = lobbies[lobbyCode].players
                    .filter((p) => p.pid === checkPoints[2].player_id)
                    .pop();
            }
        }
        if (!tiebreaker) {
            // C. does everyone have the same score ?
            logger_1.log("- everyone tied!");
            tiebreaker = checkPoints;
        }
        // create a timestamp
        const finaleTime = Date.now();
        // [...player_ids]
        const matchPID = tiebreaker.map((item) => item === null || item === void 0 ? void 0 : item.player_id);
        // filtered [...lobby.players]
        const matchPlayers = lobbies[lobbyCode].players.filter((p) => matchPID.includes(p.pid));
        // linear sort [...lobby.players]
        const topThree = matchPlayers
            .map((p) => {
            return Object.assign(Object.assign({}, p), { timeDelta: finaleTime - (p === null || p === void 0 ? void 0 : p.definitionEpoch) || Math.random() });
        })
            .sort(function (a, b) {
            return b.timeDelta - a.timeDelta;
        });
        if ((firstPlace === null || firstPlace === void 0 ? void 0 : firstPlace.pid) && !(thirdPlace === null || thirdPlace === void 0 ? void 0 : thirdPlace.pid)) {
            // A.
            topThree.unshift(firstPlace);
        }
        if ((thirdPlace === null || thirdPlace === void 0 ? void 0 : thirdPlace.pid) && !(firstPlace === null || firstPlace === void 0 ? void 0 : firstPlace.pid)) {
            // B.
            topThree.push(thirdPlace);
        }
        return yield doIt(game_id, topThree[0], topThree[1] || undefined, topThree[2] || undefined);
    });
}
exports.tieBreakerMatch = tieBreakerMatch;
//# sourceMappingURL=common.js.map