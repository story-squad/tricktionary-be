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
const JOINABLE = ["PREGAME", "RESULTS", "FINALE"];
/**
 * Connects the player with the active game being played.
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param username Player's name
 * @param lobbyCode Player's join code
 * @param lobbies game-state
 * @param doCheckPulse checks pulse of disconnected player
 * @param isReturning checks whether it is a retuning player or not
 */
function handleLobbyJoin(io, socket, username, lobbyCode, lobbies, doCheckPulse, isReturning) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, common_1.whereAmI)(socket) === lobbyCode.trim()) {
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
            return;
        }
        if (lobbyCode.length !== common_1.LC_LENGTH) {
            (0, handleErrorMessage_1.default)(io, socket, 2000, "The lobby code you entered is not long enough");
            return;
        }
        if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
            (0, handleErrorMessage_1.default)(io, socket, 2000, "The lobby code you entered does not correspond to an active room");
            return;
        }
        if (lobbies[lobbyCode].players.length > common_1.MAX_PLAYERS) {
            (0, handleErrorMessage_1.default)(io, socket, 2001, `The lobby with code ${lobbyCode} has reached the maximum player limit of ${common_1.MAX_PLAYERS}`);
            return;
        }
        let p_id;
        try {
            // Player.id
            const { data } = yield common_1.localAxios.get(`/api/auth/find-player/${socket.id}`);
            p_id = data === null || data === void 0 ? void 0 : data.id;
        }
        catch (err) {
            if (err instanceof Error) {
                (0, logger_1.log)(err.message);
            }
        }
        if (!p_id) {
            (0, logger_1.log)("!no p_id was found (corrupted token?), creating...");
            try {
                const login = yield common_1.localAxios.post("/api/auth/new-player", {
                    last_user_id: socket.id,
                });
                const newtoken = login.data.token;
                p_id = login.data.player_id;
                (0, common_1.privateMessage)(io, socket, "token update", newtoken);
            }
            catch (err) {
                if (err instanceof Error) {
                    (0, logger_1.log)(err.message);
                }
                return;
            }
        }
        else {
            (0, logger_1.log)(`!found player id: ${p_id}`);
        }
        (0, logger_1.log)(`p_id: ${p_id}`);
        if (!p_id) {
            (0, logger_1.log)("no join for you!!!");
            return;
        }
        const otherPlayers = () => lobbies[lobbyCode].players
            .filter((p) => p.pid && p.pid !== p_id)
            .filter((p) => p.id && p.id !== socket.id);
        const playerReturned = () => lobbies[lobbyCode].players.length > otherPlayers().length;
        // sort by points, ascending order
        function sortedDuplicates() {
            return lobbies[lobbyCode].players
                .filter((player) => player.pid === p_id || player.id !== socket.id)
                .sort((a, b) => a.points - b.points);
        }
        function askPartyToLeave(duplicatePlayers) {
            // ask duplicates to leave
            duplicatePlayers.forEach((p) => {
                (0, logger_1.log)(`suggesting 'disconnect me' -> ${p.id}`);
                io.to(p.id).emit("disconnect me"); // politely ask duplicate to leave
                socket.leave(p.id); // show duplicate to the exit
            });
            // remove from players list
            return (lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: otherPlayers() }));
        }
        let old_player_obj;
        if (playerReturned()) {
            const duplicates = sortedDuplicates();
            lobbies[lobbyCode] = askPartyToLeave(duplicates);
            old_player_obj = duplicates.pop(); // most points
        }
        let uname = ((_a = old_player_obj === null || old_player_obj === void 0 ? void 0 : old_player_obj.username) === null || _a === void 0 ? void 0 : _a.length) > 0 ? old_player_obj.username : username;
        // update the token,
        let points = Number(old_player_obj === null || old_player_obj === void 0 ? void 0 : old_player_obj.points) >= 0 ? Number(old_player_obj.points) : 0;
        yield (0, common_1.updatePlayerToken)(io, socket, p_id, uname, "", points, lobbyCode);
        if (((_b = lobbies[lobbyCode]) === null || _b === void 0 ? void 0 : _b.phase) in JOINABLE && !old_player_obj) {
            // prevent *new players from joining mid-game.
            (0, handleErrorMessage_1.default)(io, socket, 2002, `Unfortunately, the lobby with code ${lobbyCode} has already begun their game`);
            return;
        }
        (0, logger_1.log)(`${username} ${old_player_obj ? "re-joined" : "joined"} ${lobbyCode}`);
        // Get current round index
        const curRoundIndex = (0, common_1.getCurrentRoundIndex)(lobbies, lobbyCode);
        // add player to lobby data
        if (old_player_obj) {
            // re-construct the old player object, setting connected to true, with our new id
            // re-join
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                    ...lobbies[lobbyCode].players.filter((p) => p.id !== socket.id),
                    Object.assign(Object.assign({}, old_player_obj), { id: socket.id, connected: true, pid: p_id }),
                ] });
        }
        else {
            // this player is new
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                    ...lobbies[lobbyCode].players,
                    {
                        id: socket.id,
                        username,
                        definition: "",
                        points: 0,
                        connected: true,
                        pid: p_id,
                        playerPlacing: 0,
                    },
                ] });
            lobbies[lobbyCode].rounds[curRoundIndex] = {
                roundNum: lobbies[lobbyCode].rounds[curRoundIndex].roundNum,
                scores: [
                    ...lobbies[lobbyCode].rounds[curRoundIndex].scores,
                    { playerId: socket.id, score: 0 },
                ],
            };
        }
        // join socket to room
        socket.join(lobbyCode);
        // send welcome message
        (0, common_1.privateMessage)(io, socket, "welcome", socket.id);
        // ask room to update
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        if (doCheckPulse) {
            (0, logger_1.log)("PULSE CHECK");
            try {
                (0, crontab_1.schedulePulseCheck)(io, lobbies, lobbyCode, 5);
            }
            catch (err) {
                (0, logger_1.log)("ERROR scheduling pulse check");
            }
        }
        // Send notification to host
        let notificationData;
        if (isReturning) {
            notificationData = {
                message: "Player Re-Joined",
                description: `Player "${username}" has re-joined the party`,
                className: "player-rejoined",
            };
        }
        else {
            notificationData = {
                message: "Player Joined",
                description: `Player "${username}" has joined the fray`,
                className: "player-joined",
            };
        }
        io.emit("receive-notification", notificationData);
    });
}
exports.default = handleLobbyJoin;
//# sourceMappingURL=handleLobbyJoin.js.map