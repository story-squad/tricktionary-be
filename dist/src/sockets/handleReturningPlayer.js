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
        const last_user_id = socket.id;
        let login;
        let newtoken;
        let player;
        let game;
        try {
            login = yield common_1.localAxios.post("/api/auth/login", {
                last_user_id,
                last_token: token
            });
            player = login.data.player;
            newtoken = login.data.token;
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        common_1.privateMessage(io, socket, "token update", newtoken);
        if (player.last_played) {
            console.log("found existing lobbyCode: ", player.last_played);
            console.log("checking for on-going game");
            game = lobbies[player.last_played];
            if (game === null || game === void 0 ? void 0 : game.players) {
                console.log("found game, re-joining");
                socket.join(player.last_played);
                let hosting = false;
                if (lobbies[player.last_played].host === player.last_user_id) {
                    // re-claim host role.
                    lobbies[player.last_played].host = socket.id;
                    hosting = true;
                }
                if (lobbies[player.last_played] && lobbies[player.last_played].players) {
                    lobbies[player.last_played] = Object.assign(Object.assign({}, lobbies[player.last_played]), { players: [
                            ...lobbies[player.last_played].players,
                            {
                                id: socket.id,
                                username: hosting ? "Host" : (player.name || "re-joined"),
                                definition: "",
                                points: 0
                            }
                        ] });
                }
                // update the player record with new socket.id
                yield common_1.localAxios.put(`/api/player/id/${player.id}`, {
                    last_user_id: socket.id,
                    last_played: player.last_played
                });
                try {
                    // should this update rather than add ?
                    yield common_1.localAxios.post("/api/user-rounds/add-players", {
                        players: lobbies[player.last_played].players,
                        roundId: lobbies[player.last_played].roundId,
                        game_id: lobbies[player.last_played].game_id
                    });
                }
                catch (err) {
                    console.log("error: handleStartGame:55");
                    common_1.privateMessage(io, socket, "error", err.message);
                }
                common_1.privateMessage(io, socket, "welcome", socket.id);
                // update the lobby
                io.to(player.last_played).emit("game update", lobbies[player.last_played]); // ask room to update
            }
        }
    });
}
exports.default = handleReturningPlayer;
//# sourceMappingURL=handleReturningPlayer.js.map