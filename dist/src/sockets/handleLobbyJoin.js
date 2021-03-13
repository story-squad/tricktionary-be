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
const logger_1 = require("../logger");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
const crontab_1 = require("./crontab");
/**
 * Connects the player with the active game being played.
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param username Player's name
 * @param lobbyCode Player's join code
 * @param lobbies game-state
 */
function handleLobbyJoin(io, socket, username, lobbyCode, lobbies, doCheckPulse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (common_1.whereAmI(socket) === lobbyCode.trim()) {
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
            return;
        }
        if (lobbyCode.length !== common_1.LC_LENGTH) {
            handleErrorMessage_1.default(io, socket, 2000, "The lobby code you entered is not long enough");
            return;
        }
        if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
            handleErrorMessage_1.default(io, socket, 2000, "The lobby code you entered does not correspond to an active room");
            return;
        }
        if (lobbies[lobbyCode].players.length > common_1.MAX_PLAYERS) {
            handleErrorMessage_1.default(io, socket, 2001, `The lobby with code ${lobbyCode} has reached the maximum player limit of ${common_1.MAX_PLAYERS}`);
            return;
        }
        try {
            const last_player = yield common_1.localAxios.get(`/api/player/last-user-id/${socket.id}`);
            const p_id = last_player.data.player.id;
            yield common_1.updatePlayerToken(io, socket, p_id, username, "", 0, lobbyCode);
        }
        catch (err) {
            logger_1.log(err.message);
        }
        if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
            let rejoined = lobbies[lobbyCode].players.filter((p) => (p === null || p === void 0 ? void 0 : p.rejoinedAs) && p.rejoinedAs === socket.id).length > 0;
            if (lobbies[lobbyCode].phase !== "PREGAME" && !rejoined) {
                // prevent *new players from joining mid-game.
                handleErrorMessage_1.default(io, socket, 2002, `Unfortunately, the lobby with code ${lobbyCode} has already begun their game`);
                return;
            }
            logger_1.log(`${username} ${rejoined ? "re-joined" : "joined"} ${lobbyCode}`);
            if (!(lobbies[lobbyCode].players.filter((p) => p.id === socket.id)
                .length > 0)) {
                if (!rejoined) {
                    // this player is new
                    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                            ...lobbies[lobbyCode].players,
                            {
                                id: socket.id,
                                username,
                                definition: "",
                                points: 0,
                                connected: true,
                            },
                        ] });
                }
                else {
                    // this player has returned
                    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                            ...lobbies[lobbyCode].players.map((p) => {
                                if ((p === null || p === void 0 ? void 0 : p.rejoinedAs) && p.rejoinedAs === socket.id) {
                                    return Object.assign(Object.assign({}, p), { id: socket.id, connected: true });
                                }
                                return p;
                            }),
                        ] });
                }
                socket.join(lobbyCode);
            }
        }
        common_1.privateMessage(io, socket, "welcome", socket.id);
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
        if (doCheckPulse) {
            logger_1.log("PULSE CHECK");
            try {
                crontab_1.schedulePulseCheck(io, lobbies, lobbyCode, 5);
            }
            catch (err) {
                logger_1.log("ERROR scheduling pulse check");
            }
        }
    });
}
exports.default = handleLobbyJoin;
//# sourceMappingURL=handleLobbyJoin.js.map