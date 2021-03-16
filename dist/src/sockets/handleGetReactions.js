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
const logger_1 = require("../logger");
function getReactions(io, socket, lobbies) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = common_1.whereAmI(socket) || "";
        if (!lobbyCode.length) {
            logger_1.log(`could not find a lobbyCode for socket with id ${socket.id}`);
            return;
        }
        const game_id = lobbies[lobbyCode].game_id;
        const roundId = lobbies[lobbyCode].roundId;
        try {
            let { data } = yield common_1.localAxios.get(`/api/smash/totals/${game_id}/${roundId}`);
            io.to(socket.id).emit("get reactions", data);
        }
        catch (err) {
            logger_1.log(err.message);
            io.to(socket.id).emit("get reactions", []);
        }
    });
}
exports.default = getReactions;
//# sourceMappingURL=handleGetReactions.js.map