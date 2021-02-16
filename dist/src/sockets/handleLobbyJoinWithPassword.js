"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
function handleLobbyJoinWithPassword(io, socket, username, password, lobbyCode, lobbies) {
    console.log('LOBBY-JOIN-WITH-PASSWORD');
    if (!password) {
        console.log("password ?");
        return;
    }
    if (common_1.whereAmI(socket) === lobbyCode.trim()) {
        io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
        return;
    }
    if (lobbyCode.length !== common_1.LC_LENGTH) {
        handleErrorMessage_1.default(io, socket, "bad lobby code.");
        return;
    }
    if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
        handleErrorMessage_1.default(io, socket, "cool it, hackerman.");
        return;
    }
    if (!lobbies["waiting"]) {
        handleErrorMessage_1.default(io, socket, "I don't see any reservations listed for this lobby.");
        return;
    }
    const reservation = lobbies["waiting"].filter((r) => r.lobbbyCode === lobbyCode && r.password == password);
    if (reservation.length === 0) {
        handleErrorMessage_1.default(io, socket, "I can't find your reservation.");
        return;
    }
    let hosting = false;
    if (reservation[0].old_user_id === lobbyCode[lobbyCode].host) {
        console.log("host is re-joining...");
        hosting = true;
    }
    console.log(`${username} joined ${lobbyCode}`);
    socket.join(lobbyCode);
    lobbies[lobbyCode] = Object.assign(Object.assign({}, lobbies[lobbyCode]), { host: hosting ? socket.id : lobbies[lobbyCode].host, players: [
            ...lobbies[lobbyCode].players,
            { id: socket.id, username, definition: "", points: 0 }
        ] });
    io.to(socket.id).emit("welcome", socket.id); // private message new player with id
    // ask others to add this player
    // io.to(lobbyCode).emit("add player", {
    //   id: socket.id,
    //   username,
    //   definition: "",
    //   points: 0
    // });
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
}
exports.default = handleLobbyJoinWithPassword;
//# sourceMappingURL=handleLobbyJoinWithPassword.js.map