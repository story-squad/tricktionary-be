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
        logger_1.log("[Finale]");
        const present = lobbyCode && common_1.whereAmI(socket) === lobbyCode;
        if (!present) {
            handleErrorMessage_1.default(io, socket, 2004, "You're not in the lobby");
        }
        const authorized = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (!authorized.ok) {
            handleErrorMessage_1.default(io, socket, 2005, "You're not the host and can not end the game");
        }
        const game_id = lobbies[lobbyCode].game_id;
        let results;
        // get points from the scoreCard
        const checkScores = yield common_1.localAxios.get(`/api/score/latest/${game_id}`);
        // sort by total game points.
        const checkPoints = checkScores.data
            .sort((a, b) => b.points - a.points)
            .filter((c) => c.top_definition_id); // only players who have submitted definitions
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
            results = yield common_1.doIt(game_id, naturalTopThree[0], naturalTopThree[1] || undefined, naturalTopThree[2] || undefined);
        }
        else {
            results = yield common_1.tieBreakerMatch(checkPoints, game_id, lobbies, lobbyCode);
        }
        // add results to game-data & change phase
        lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { topThree: results, phase: "FINALE" });
        // update players
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
    });
}
exports.default = handleSetFinale;
//# sourceMappingURL=handleSetFinale.js.map