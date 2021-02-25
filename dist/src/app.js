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
exports.socketApp = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socketIO = __importStar(require("socket.io"));
const sockets_1 = __importDefault(require("./sockets"));
const bodyParser = __importStar(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./api/words/routes"));
const routes_2 = __importDefault(require("./api/reactions/routes"));
const routes_3 = __importDefault(require("./api/definitionReactions/routes"));
const routes_4 = __importDefault(require("./api/votes/routes"));
const routes_5 = __importDefault(require("./api/rounds/routes"));
const routes_6 = __importDefault(require("./api/userRounds/routes"));
const routes_7 = __importDefault(require("./api/definitions/routes"));
const routes_8 = __importDefault(require("./api/admin/routes"));
const routes_9 = __importDefault(require("./api/auth/routes"));
const routes_10 = __importDefault(require("./api/player/routes"));
const routes_11 = __importDefault(require("./api/game/routes"));
const routes_12 = __importDefault(require("./api/played/routes"));
const routes_13 = __importDefault(require("./api/hostChoices/routes"));
// testing
const routes_14 = __importDefault(require("./api/clever/routes"));
const logger_1 = require("./logger");
logger_1.log("Tricktionary");
const api = express_1.default();
const JSON_SIZE_LIMIT = "5mb";
const lobbies = { DEADBEEF: [] };
api.use(bodyParser.json({
    limit: JSON_SIZE_LIMIT
}));
api.use(helmet_1.default());
api.use(cors_1.default());
api.use(express_1.default.json());
api.use("/help", express_1.default.static(path_1.default.join(__dirname, "docs")));
// CRUD routes
api.get("/", (req, res) => res.status(200).json({ api: "running", timestamp: Date.now() }));
api.get("/api", (req, res) => res.status(200).json({ api: "𝜋", timestamp: Date.now() }));
api.use("/api/words", routes_1.default);
api.use("/api/definition-reactions", routes_3.default);
api.use("/api/reactions", routes_2.default);
api.use("/api/votes", routes_4.default);
api.use("/api/round", routes_5.default);
api.use("/api/user-rounds", routes_6.default);
api.use("/api/definitions", routes_7.default);
api.use("/api/admin", routes_8.default);
api.use("/api/auth", routes_9.default);
api.use("/api/player", routes_10.default);
api.use("/api/game", routes_11.default);
api.use("/api/played", routes_12.default);
api.use("/api/choice", routes_13.default);
// testing
api.use("/api/clever", routes_14.default);
// web sockets
const socketApp = http_1.createServer(api);
exports.socketApp = socketApp;
const io = new socketIO.Server(socketApp, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    // LOGIN
    socket.on("login", (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (token && token.length > 0) {
            sockets_1.default.handleReturningPlayer(io, socket, token, lobbies);
        }
        else {
            sockets_1.default.handleNewPlayer(io, socket);
        }
    }));
    // more events to come.
    socket.on("disconnecting", () => {
        sockets_1.default.handleDisconnection(io, socket, lobbies);
    });
    socket.on("update username", (newUsername) => {
        sockets_1.default.handleUpdateUsername(io, socket, lobbies, newUsername);
    });
    socket.on("synchronize", (seconds) => {
        sockets_1.default.handleTimeSync(io, socket, lobbies, seconds);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
    socket.on("create lobby", (username) => {
        sockets_1.default.handleLobbyCreate(io, socket, username, lobbies);
    });
    socket.on("join lobby", (username, lobbyCode) => {
        sockets_1.default.handleLobbyJoin(io, socket, username, lobbyCode, lobbies, false);
    });
    socket.on("start game", (settings, lobbyCode, hostChoice) => {
        sockets_1.default.handleStartGame(io, socket, lobbyCode, lobbies, settings, hostChoice);
    });
    socket.on("definition submitted", (definition, lobbyCode) => {
        sockets_1.default.handleSubmitDefinition(io, socket, definition, lobbyCode, lobbies);
    });
    socket.on("guess", (lobbyCode, guesses) => {
        sockets_1.default.handleArrayOfGuesses(io, socket, lobbyCode, lobbies, guesses);
    });
    socket.on("msg host", (message) => {
        sockets_1.default.handleMessageHost(io, socket, lobbies, "msg host", message);
    });
    socket.on("player guess", (playerId, definitionKey) => {
        sockets_1.default.handleMessagePlayer(io, socket, lobbies, playerId, "player guess", definitionKey);
    });
    socket.on("play again", (settings, lobbyCode) => {
        sockets_1.default.handlePlayAgain(io, socket, lobbyCode, lobbies, settings);
    });
    socket.on("set phase", (phase, lobbyCode) => {
        sockets_1.default.handleSetPhase(io, socket, lobbyCode, lobbies, phase);
    });
    socket.on("set host", (newHost, lobbyCode, guesses) => {
        sockets_1.default.handleSetNewHost(io, socket, lobbyCode, lobbies, newHost, guesses);
    });
    socket.on("reveal results", (lobbyCode, guesses) => {
        sockets_1.default.handleRevealResults(io, socket, lobbyCode, lobbies, guesses);
    });
    socket.on("set finale", (lobbyCode) => {
        sockets_1.default.handleSetFinale(io, socket, lobbyCode, lobbies);
    });
});
//# sourceMappingURL=app.js.map