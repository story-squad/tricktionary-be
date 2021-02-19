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
        const present = lobbyCode && common_1.whereAmI(socket) === lobbyCode;
        if (!present) {
            handleErrorMessage_1.default(io, socket, "use your own letter box");
        }
        const authorized = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (!authorized.ok) {
            handleErrorMessage_1.default(io, socket, "please don't provoke the saber tooth kittens");
        }
        const game_id = lobbies[lobbyCode].game_id;
        // get the first 3 players, sorted by points in descending order.
        const topThree = lobbies[lobbyCode].players
            .sort(function (a, b) {
            return b.points - a.points;
        })
            .slice(0, 3);
        // 1) assign the resulting player(s) to constant placeholder values,
        const firstPlace = topThree[0];
        const secondPlace = topThree[1] || undefined;
        const thirdPlace = topThree[2] || undefined;
        // 2) await, at the top level, the result of asynchronous operations
        let mostVotedRound;
        let mvd;
        const results = [];
        function finalFormat(defRecord) {
            const { user_id, definition } = defRecord;
            return { user_id, definition };
        }
        // get most voted definition, firstPlace
        try {
            let fp = yield common_1.localAxios.get(`/api/user-rounds/user/${firstPlace.id}/game/${game_id}`);
            firstPlace["user_rounds"] = fp.data.user_rounds;
            mostVotedRound = firstPlace.user_rounds.sort(function (a, b) {
                return b.votes - a.votes;
            })[0].round_id;
            mvd = yield common_1.localAxios.get(`/api/definitions/user/${firstPlace.id}/round/${mostVotedRound}`);
            results.push(finalFormat(mvd.data.definition));
        }
        catch (err) {
            console.log(err.message);
        }
        // get most voted definition, secondPlace
        try {
            if (secondPlace) {
                let sp = yield common_1.localAxios.get(`/api/user-rounds/user/${secondPlace.id}/game/${game_id}`);
                secondPlace["user_rounds"] = sp.data.user_rounds;
                mostVotedRound = secondPlace.user_rounds.sort(function (a, b) {
                    return b.votes - a.votes;
                })[0].round_id;
                mvd = yield common_1.localAxios.get(`/api/definitions/user/${secondPlace.id}/round/${mostVotedRound}`);
                results.push(finalFormat(mvd.data.definition));
            }
        }
        catch (err) {
            console.log(err.message);
        }
        // get most voted definition, thirdPlace
        try {
            if (thirdPlace) {
                let tp = yield common_1.localAxios.get(`/api/user-rounds/user/${thirdPlace.id}/game/${game_id}`);
                thirdPlace["user_rounds"] = tp.data.user_rounds;
                mostVotedRound = thirdPlace.user_rounds.sort(function (a, b) {
                    return b.votes - a.votes;
                })[0].round_id;
                mvd = yield common_1.localAxios.get(`/api/definitions/user/${thirdPlace.id}/round/${mostVotedRound}`);
                results.push(finalFormat(mvd.data.definition));
            }
        }
        catch (err) {
            console.log(err.message);
        }
        lobbies[lobbyCode].topThree = results;
        // console.log(results);
        lobbies[lobbyCode].phase = "FINALE";
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode], results);
    });
}
exports.default = handleSetFinale;
//# sourceMappingURL=handleSetFinale.js.map