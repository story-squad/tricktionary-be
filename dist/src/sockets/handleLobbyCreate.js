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
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../options");
const logger_1 = require("../logger");
const common_1 = require("./common");
function handleLobbyCreate(io, socket, username, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = options_1.pseudoRandomizer("A", common_1.LC_LENGTH);
        socket.join(lobbyCode);
        let og_host;
        let request_game;
        let game_id;
        function createGame(host) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    request_game = yield common_1.localAxios.post(`/api/game/new`, { og_host: host });
                }
                catch (err) {
                    logger_1.log(err.message);
                    return;
                }
                return (request_game === null || request_game === void 0 ? void 0 : request_game.data.ok) ? request_game === null || request_game === void 0 ? void 0 : request_game.data.game_id : undefined;
            });
        }
        try {
            const last_player = yield common_1.localAxios.get(`/api/player/last-user-id/${socket.id}`);
            if (last_player.data.player && last_player.data.player.id) {
                // create the Game
                og_host = last_player.data.player.id;
                game_id = yield createGame(og_host);
            }
        }
        catch (err) {
            logger_1.log(err.message);
        }
        logger_1.log("LOBBY CREATED BY: " + og_host);
        logger_1.log("GAME : " + game_id); // returns UNDEFINED
        if (!game_id || !og_host) {
            try {
                logger_1.log("[!game_id] asking HOST to retry create lobby");
                const newhost = og_host || socket.id;
                // ask player to retry with new token
                const { token } = yield common_1.updatePlayerToken(io, socket, newhost, username, "", 0, lobbyCode, "retry create lobby");
                if (!token) {
                    logger_1.log("[!ERROR] creating new token for host");
                    return;
                }
                // (restart the process)
                og_host = newhost;
                game_id = yield createGame(og_host);
                logger_1.log(`created new token for host with game_id : ${game_id}`);
            }
            catch (err) {
                logger_1.log("[ERROR] sending token with 'retry create lobby'");
                logger_1.log(err.message);
                return;
            }
        }
        lobbies[lobbyCode] = {
            game_id,
            lobbyCode,
            players: [
                { id: socket.id, username, definition: "", points: 0, connected: true }
            ],
            host: socket.id,
            phase: "PREGAME",
            word: "",
            definition: "",
            guesses: [],
            roundId: null
        };
        try {
            yield common_1.updatePlayerToken(io, socket, og_host, username, "", 0, lobbyCode);
        }
        catch (err) {
            logger_1.log(err.message);
        }
        common_1.privateMessage(io, socket, "welcome", socket.id);
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.default = handleLobbyCreate;
//# sourceMappingURL=handleLobbyCreate.js.map