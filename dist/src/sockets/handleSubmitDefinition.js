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
function handleSubmitDefinition(io, socket, definition, lobbyCode, lobbies) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const definitionEpoch = Date.now(); // add a timestamp to the player for tie-breaking
        let newPlayer = yield lobbies[lobbyCode].players.find((player) => player.id === socket.id);
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
            });
        }
        catch (err) {
            logger_1.log("errror! handleSubmitDefinitions:22");
            return handleErrorMessage_1.default(io, socket, 2003, "There was a server error while submitting your definition.");
        }
        // then ...
        const definitionId = (_a = newDef === null || newDef === void 0 ? void 0 : newDef.data) === null || _a === void 0 ? void 0 : _a.definitionId;
        if (!definitionId) {
            // error submitting definition, 
            return handleErrorMessage_1.default(io, socket, 2003, "There was a server error while submitting your definition.");
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
            logger_1.log(newDef);
        }
        logger_1.log(`Definitions: ${numSubmitted}/${lobbies[lobbyCode].players.length}`);
        if (numSubmitted === lobbies[lobbyCode].players.length) {
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { phase: "GUESSING" });
        }
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.default = handleSubmitDefinition;
//# sourceMappingURL=handleSubmitDefinition.js.map