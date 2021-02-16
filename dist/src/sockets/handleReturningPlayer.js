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
function handleReturningPlayer(io, socket, token, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = socket.id;
        let login;
        let newtoken;
        let player;
        let old_user_id = "";
        // try logging in with the old token
        try {
            login = yield common_1.localAxios.post("/api/auth/login", {
                user_id,
                last_token: token
            });
            console.log("DATA", login.data);
            player = login.data.player;
            newtoken = login.data.token;
            old_user_id = login.data.old_user_id;
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        // send player their new token.
        common_1.privateMessage(io, socket, "token update", newtoken);
        // check for last_played activity
        if (!player.last_played || !common_1.gameExists(player.last_played, lobbies)) {
            console.log(player.last_played, " game not found.");
            return;
        }
        socket.join(player.last_played);
        if (lobbies[player.last_played].players.filter((p) => p.id === socket.id).length === 0) {
            lobbies[player.last_played].players = lobbies[player.last_played].players.map((player) => {
                if (player.id === old_user_id) {
                    return Object.assign(Object.assign({}, player), { id: socket.id, connected: true });
                }
                return player;
            });
        }
        if (lobbies[player.last_played].host === old_user_id) {
            // update host
            lobbies[player.last_played].host = socket.id;
            common_1.privateMessage(io, socket, "info", `ok, set host: ${socket.id}`);
        }
        console.log("updating from returning player...");
        io.to(player.last_played).emit("game update", lobbies[player.last_played]); // ask room to update
        // finally, we give player the option to rejoin.
        // privateMessage(io, socket, "ask rejoin", player.last_played);
    });
}
exports.default = handleReturningPlayer;
//# sourceMappingURL=handleReturningPlayer.js.map