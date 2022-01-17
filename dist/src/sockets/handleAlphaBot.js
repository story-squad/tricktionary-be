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
const logger_1 = require("../logger");
const common_1 = require("./common");
const uuid_1 = require("uuid");
/**
 * Handles the addition/removal of bots in the game
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param botName Bot's name
 * @param botID Bot's ID
 * @param action whether we are removing or adding a bot
 * @param lobbyCode Bot's join code
 * @param lobbies game-state
 */
function handleAlphaBot(io, socket, botName, botID, action, lobbyCode, lobbies) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //* Specify which phases are joinable
        const JOINABLE = ["PREGAME", "FINALE"];
        //* Check if the lobby code is valid
        if (lobbyCode.length !== common_1.LC_LENGTH) {
            (0, logger_1.log)(`The lobby code in which the bot ${botName} is entering is not long enough`);
            return;
        }
        //* Check if the lobby with the provided lobby code exists
        if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
            (0, logger_1.log)(`The lobby code in which the bot ${botName} is entering does not correspond to an active room`);
            return;
        }
        //* Ensure we can add the bot only if the state of the game is joinable
        if (((_a = lobbies[lobbyCode]) === null || _a === void 0 ? void 0 : _a.phase) in JOINABLE) {
            (0, logger_1.log)(`The lobby in which the bot ${botName} is entering has already begun their game and cannot join`);
            return;
        }
        //* Get current round index
        const curRoundIndex = (0, common_1.getCurrentRoundIndex)(lobbies, lobbyCode);
        //* Either add or remove the bot from the list
        if (action === "add") {
            // Create a UUID with proper syntax for pid
            const uuId = (0, uuid_1.v4)();
            // Add bot to bots list
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { bots: [
                    ...lobbies[lobbyCode].bots,
                    {
                        id: botID,
                        botName: botName,
                    },
                ], players: [
                    ...lobbies[lobbyCode].players,
                    {
                        id: botID,
                        username: botName,
                        definition: "",
                        points: 0,
                        connected: true,
                        pid: uuId,
                    },
                ] });
            // Add bot to the round player list
            lobbies[lobbyCode].rounds[curRoundIndex] = {
                roundNum: lobbies[lobbyCode].rounds[curRoundIndex].roundNum,
                scores: [
                    ...lobbies[lobbyCode].rounds[curRoundIndex].scores,
                    { playerId: botID, score: 0 },
                ],
            };
            (0, logger_1.log)(`The bot ${botName}, with ID ${botID} has been added to game ${lobbyCode}`);
        }
        else {
            // Remove the bot from the bot list
            lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { bots: [...lobbies[lobbyCode].bots.filter((b) => b.id !== botID)], players: [
                    ...lobbies[lobbyCode].players.filter((b) => b.id !== botID),
                ] });
            // Add bot to the round player list
            lobbies[lobbyCode].rounds[curRoundIndex] = Object.assign(Object.assign({}, lobbies[lobbyCode].rounds[curRoundIndex]), { scores: [
                    ...lobbies[lobbyCode].rounds[curRoundIndex].scores.filter((b) => b.playerId !== botID),
                ] });
            (0, logger_1.log)(`The bot ${botName}, with ID ${botID} has been removed from game ${lobbyCode}`);
        }
        // ask room to update
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.default = handleAlphaBot;
//# sourceMappingURL=handleAlphaBot.js.map