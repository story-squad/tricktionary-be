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
function handleLobbyJoin(io, socket, username, lobbyCode, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("LOBBY-JOIN");
        // if (whereAmI(socket) === lobbyCode.trim()) {
        //   // console.log("I am already here");
        //   // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players)
        //   io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
        //   return;
        // }
        if (lobbyCode.length !== common_1.LC_LENGTH) {
            handleErrorMessage_1.default(io, socket, "bad lobby code.");
            return;
        }
        if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
            handleErrorMessage_1.default(io, socket, "cool it, hackerman.");
            return;
        }
        try {
            const last_player = yield common_1.localAxios.get(`/api/player/last-user-id/${socket.id}`);
            const p_id = last_player.data.player.id;
            yield common_1.updatePlayerToken(io, socket, p_id, username, "", 0, lobbyCode);
        }
        catch (err) {
            console.log(err.message);
        }
        if (lobbies[lobbyCode].phase !== "PREGAME") {
            // prevent players from joining mid-game.
            handleErrorMessage_1.default(io, socket, "Game in progress; cannot join.");
            return;
        }
        if (lobbies[lobbyCode] && lobbies[lobbyCode].players) {
            console.log(`${username} joined ${lobbyCode}`);
            socket.join(lobbyCode);
            if (!(lobbies[lobbyCode].players.filter((p) => p.id === socket.id)
                .length > 0)) {
                lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { players: [
                        ...lobbies[lobbyCode].players,
                        {
                            id: socket.id,
                            username,
                            definition: "",
                            points: 0,
                            connected: true
                        }
                    ] });
            }
        }
        common_1.privateMessage(io, socket, "welcome", socket.id);
        // ask others to add this player
        // io.to(lobbyCode).emit("add player", { id: socket.id, username, definition: "", points: 0 })
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
        // right now, sending just the player list knocks everyone out of the room. sending the "game update" works.
        // io.to(lobbyCode).emit("player list", lobbies[lobbyCode].players); // send player list
        console.log(lobbies[lobbyCode]);
    });
}
exports.default = handleLobbyJoin;
//# sourceMappingURL=handleLobbyJoin.js.map