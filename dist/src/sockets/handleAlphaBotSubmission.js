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
 * Handles the addition/removal of bots in the game
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param definition Bot's definition submission
 * @param botID Bot's ID
 * @param lobbyCode Bot's join code
 * @param lobbies game-state
 */
function handleAlphaBotSubmission(io, socket, definition, botID, lobbyCode, lobbies) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const definitionEpoch = Date.now(); // add a timestamp to the player for tie-breaking
        let newPlayer = yield lobbies[lobbyCode].players.find((player) => player.id === botID);
        const game_id = lobbies[lobbyCode].game_id;
        let numSubmitted = 0;
        // add new definition.
        let newDef;
        try {
            newPlayer.definition = definition;
            numSubmitted++;
            newDef = yield common_1.localAxios.post("/api/definitions/new", {
                playerId: newPlayer.id,
                definition,
                roundId: lobbies[lobbyCode].roundId,
                pid: newPlayer.pid,
                game_id,
            });
        }
        catch (err) {
            (0, logger_1.log)("errror! handleAlphaBotSubmission:22");
            (0, logger_1.log)(`There was a server error while ${botID} submitted their definition.`);
        }
        // then ...
        const definitionId = (_a = newDef === null || newDef === void 0 ? void 0 : newDef.data) === null || _a === void 0 ? void 0 : _a.definitionId;
        if (!definitionId) {
            // error submitting definition,
            (0, logger_1.log)(`There was a server error while ${botID} submitted their definition.`);
        }
        newPlayer = Object.assign(Object.assign({}, newPlayer), { definitionId, definitionEpoch }); // store definition id
        // update & count number of player submissions
        lobbies[lobbyCode].players = lobbies[lobbyCode].players.map((player) => {
            if (player.definition && player.id !== newPlayer.id) {
                numSubmitted++;
            }
            return player.id === newPlayer.id ? newPlayer : player;
        });
        if (!definitionId) {
            (0, logger_1.log)(newDef);
        }
        (0, logger_1.log)(`Definitions: ${numSubmitted}/${lobbies[lobbyCode].players.length}`);
        if (numSubmitted === lobbies[lobbyCode].players.length) {
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { phase: "GUESSING" });
        }
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.default = handleAlphaBotSubmission;
//# sourceMappingURL=handleAlphaBotSubmission.js.map