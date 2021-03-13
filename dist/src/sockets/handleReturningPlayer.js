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
const handleLobbyJoin_1 = __importDefault(require("./handleLobbyJoin"));
/**
 * Determine whether or not the player should auto re-join an existing game.
 *
 * In the case of a rejoin; It calls **handleLobbyJoin**
 * _after marking the old player with the incoming socket.id_
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param token JWT
 * @param lobbies game-state
 */
function handleReturningPlayer(io, socket, token, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = socket.id;
        let login;
        let newtoken;
        let player;
        let old_user_id = "";
        let old_user_name = "";
        // try logging in with the old token
        try {
            login = yield common_1.localAxios.post("/api/auth/login", {
                user_id,
                last_token: token,
            });
            player = login.data.player;
            newtoken = login.data.token;
            old_user_id = login.data.old_user_id;
            old_user_name = login.data.old_user_name;
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        // send player their new token.
        common_1.privateMessage(io, socket, "token update", newtoken);
        // check for last_played activity
        if (!player.last_played || !lobbies[player.last_played]) {
            logger_1.log(`${player.last_played}, game not found.`);
            return;
        }
        // if we're not already in the room,
        if (lobbies[player.last_played].players.filter((p) => p.id === socket.id)
            .length === 0) {
            // if this is a re-join, make it known.
            lobbies[player.last_played].players = lobbies[player.last_played].players.map((player) => {
                if (player.id === old_user_id) {
                    return Object.assign(Object.assign({}, player), { rejoinedAs: socket.id });
                }
                return player;
            });
        }
        if (lobbies[player.last_played].host === old_user_id) {
            // if they were the host, give them back their powers.
            lobbies[player.last_played].host = socket.id;
        }
        // move the player forward.
        handleLobbyJoin_1.default(io, socket, old_user_name, player.last_played, lobbies, true);
    });
}
exports.default = handleReturningPlayer;
//# sourceMappingURL=handleReturningPlayer.js.map