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
        let old_user_id;
        // try logging in with the old token
        try {
            login = yield common_1.localAxios.post("/api/auth/login", {
                user_id,
                last_token: token
            });
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
            console.log("...no active game was found.");
            return;
        }
        // player has a game they may want to rejoin.
        const rejoinable = {
            lobbyCode: player.last_played,
            player,
            password: newtoken.slice(newtoken.length - 4),
            old_user_id
        };
        if (lobbies["waiting"]) {
            // if we have people waiting, join them
            lobbies["waiting"] = [...lobbies["waiting"], rejoinable];
        }
        else {
            lobbies["waiting"] = [rejoinable];
        }
        // finally, we give player the option to rejoin.
        common_1.privateMessage(io, socket, "ask rejoin", player.last_played);
    });
}
exports.default = handleReturningPlayer;
//# sourceMappingURL=handleReturningPlayer.js.map