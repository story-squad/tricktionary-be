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
const common_1 = require("./common");
const logger_1 = require("../logger");
/**
 *
 * Allow the current host to trade roles with a player. *experimental feature
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param newHost playerID-string
 * @param guesses the hosts' list of the other player's guesses
 */
function handleSetNewHost(io, socket, lobbyCode, lobbies, newHost, guesses) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const checkIfHost = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
        if (checkIfHost.ok) {
            (0, logger_1.log)(`${lobbyCode} has a new Host, ${newHost}`);
            // create a score-card if not already existant.
            const hostPlayer = lobbies[lobbyCode].players.filter((p) => p.id === newHost)[0];
            const pid = hostPlayer === null || hostPlayer === void 0 ? void 0 : hostPlayer.pid;
            if (!pid) {
                (0, logger_1.log)(`[!ERROR SETTING NEW HOST]`);
            }
            const game_id = lobbies[lobbyCode].game_id;
            const url_path = `/api/score/player/${pid}/game/${game_id}`;
            const username = hostPlayer.username || "(old host)";
            try {
                // ensure host has a score card
                let score = yield common_1.localAxios.get(url_path);
                if (!score.data.id) {
                    (0, logger_1.log)(`creating score card for ${username}`);
                    score = yield common_1.localAxios.post("/api/score/new", {
                        game_id,
                        player_id: pid,
                    });
                    (0, logger_1.log)(`created score card ${(_a = score.data) === null || _a === void 0 ? void 0 : _a.id} for ${username}`);
                }
                lobbies[lobbyCode].host = newHost;
            }
            catch (err) {
                console.log(err);
                return;
            }
            io.to(newHost).emit("welcome host", guesses);
            (0, common_1.privateMessage)(io, socket, "info", `ok, set host: ${newHost}`);
            io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
        }
        else {
            (0, logger_1.log)(`NOT HOST: ${socket.id}, cannot assign a new host`);
            (0, common_1.privateMessage)(io, socket, "error", "unauthorized call, punk!");
        }
    });
}
exports.default = handleSetNewHost;
//# sourceMappingURL=handleSetNewHost.js.map