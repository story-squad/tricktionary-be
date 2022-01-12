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
/**
 *
 * Allows the host to store and retrieve
 *
 * 1) three top scoring users
 * 2) these users' top-three definitions for the whole game (from any round)
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 */
function handleSetFinale(io, socket, lobbyCode, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, logger_1.log)("[Finale]");
        const present = lobbyCode && (0, common_1.whereAmI)(socket) === lobbyCode;
        if (!present) {
            (0, handleErrorMessage_1.default)(io, socket, 2004, "You're not in the lobby");
        }
        const authorized = (0, common_1.playerIsHost)(socket, lobbyCode, lobbies);
        if (!authorized.ok) {
            (0, handleErrorMessage_1.default)(io, socket, 2005, "You're not the host and can not end the game");
        }
        const game_id = lobbies[lobbyCode].game_id;
        let results;
        let checkPoints;
        try {
            const postScores = yield common_1.localAxios.post(`/api/score/latest/${game_id}`);
            // sort by total game points.
            checkPoints = postScores.data
                .sort((a, b) => b.points - a.points)
                .filter((c) => c.top_definition_id); // only players who have submitted definitions
        }
        catch (err) {
            (0, logger_1.log)("error posting scores");
        }
        // cast point values into a set
        const values = new Set(checkPoints.map((v) => v.points));
        if (values.size === checkPoints.length) {
            // if player.points are unique, no tie-breaker will be necessary.
            const pids = checkPoints.map((e) => e.player_id);
            // filter/sort by player_id/points
            const naturalTopThree = lobbies[lobbyCode].players
                .filter((player) => pids.includes(player.pid))
                .sort(function (a, b) {
                return b.points - a.points;
            });
            results = yield (0, common_1.doIt)(game_id, naturalTopThree[0], naturalTopThree[1] || undefined, naturalTopThree[2] || undefined);
        }
        else {
            results = yield (0, common_1.tieBreakerMatch)(checkPoints, game_id, lobbies, lobbyCode);
        }
        let data;
        let topThree;
        let n = 0;
        try {
            // finally, get the updated leaderboard for this game.
            const leaderBoard = yield common_1.localAxios.get(`/api/game/leaderboard/${game_id}`);
            data = leaderBoard === null || leaderBoard === void 0 ? void 0 : leaderBoard.data;
            // merge current user with leaderboard data
            topThree = results.map((r) => {
                const cu = lobbies[lobbyCode].players.filter((p) => p.id === r.user_id)[0];
                const lb = data.filter((player) => player.player_id === cu.pid)[0] || undefined;
                (0, logger_1.log)(`[${game_id}] ${n + 1}${['st', 'nd', 'rd'][n]} place -> ${cu.username}`);
                n++;
                return {
                    user_id: r.user_id,
                    definition: (lb === null || lb === void 0 ? void 0 : lb.top_definition) || r.definition,
                    word: (lb === null || lb === void 0 ? void 0 : lb.word) || r.word,
                };
            });
        }
        catch (err) {
            (0, logger_1.log)(err);
            // if we have a problem with the leaderboard endpoint, log it and return the current results
            topThree = results;
        }
        // add topThree to game-data & change phase
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { topThree, phase: "FINALE" });
        // update players
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
    });
}
exports.default = handleSetFinale;
//# sourceMappingURL=handleSetFinale.js.map