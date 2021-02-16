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
function handleUpdateUsername(io, socket, lobbies, newUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = common_1.whereAmI(socket);
        if (!lobbyCode) {
            // not likely to occur... but we can station a guard here to prevent developer-errors.
            console.log("WTF!?");
            return;
        }
        const oldPlayer = lobbies[lobbyCode].players.filter((player) => player.id === socket.id)[0];
        // update the player name's name witin the lobby
        // const {id, username, definition, points} = oldPlayer;
        const updatedPlayer = Object.assign(Object.assign({}, oldPlayer), { username: newUsername });
        // make a copy of the player list that doesn't include oldPlayer.
        const otherPlayers = lobbies[lobbyCode].players.filter((player) => player.id !== socket.id);
        // generate a new playerlist that includes this player's updated username.
        lobbies[lobbyCode].players = [...otherPlayers, updatedPlayer];
        // create a new token for the player that includes their username (in case of disconnection)
        try {
            // get the Player Table record id
            const { data } = yield common_1.localAxios.get(`/api/auth/find-player/${socket.id}`);
            yield common_1.localAxios.post("/api/auth/update-token", {
                s_id: socket.id,
                p_id: data.id,
                name: updatedPlayer.username,
                definition: updatedPlayer.definition,
                points: updatedPlayer.points,
                lobbyCode
            });
            // *notify other players if the change.
            io.to(lobbyCode).emit("updated username", updatedPlayer.id, updatedPlayer.username);
        }
        catch (err) {
            console.log(err.message);
        }
        // console.log(lobbies[lobbyCode].players);
        // send the token to the player
        // io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
    });
}
exports.default = handleUpdateUsername;
//# sourceMappingURL=handleUpdateUsername.js.map