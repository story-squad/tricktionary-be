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
 * Reveal results to players
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbyCode key-string
 * @param lobbies memo-object
 * @param guesses array
 */
function handleRevealResults(io, socket, lobbyCode, lobbies, guesses) {
    return __awaiter(this, void 0, void 0, function* () {
        const present = lobbyCode && common_1.whereAmI(socket) === lobbyCode;
        if (!present) {
            handleErrorMessage_1.default(io, socket, "use your own letter box");
        }
        const authorized = common_1.playerIsHost(socket, lobbyCode, lobbies);
        if (!authorized.ok) {
            handleErrorMessage_1.default(io, socket, "please don't provoke the saber tooth kittens");
        }
        io.to(lobbyCode).emit("reveal results", guesses);
    });
}
exports.default = handleRevealResults;
//# sourceMappingURL=handleRevealResults.js.map