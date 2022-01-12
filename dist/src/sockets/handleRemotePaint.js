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
/**
 *
 * remote paint on canvas
 *
 * @param io (socketio)
 * @param socket (socketio)
 * @param lobbies memo-object
 * @param coords mouse coordinates [x, y, x, y]
 */
function handleRemotePaint(io, socket, lobbies, coords) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyCode = (0, common_1.whereAmI)(socket);
        if (!lobbyCode) {
            (0, logger_1.log)(`[!ERROR] socket.id ${socket.id}: cannot paint without a lobbyCode`);
            return;
        }
        const phase = lobbies[lobbyCode].phase;
        if (phase !== "PAINT") {
            (0, logger_1.log)(`[!ERROR] socket.id ${socket.id}: cannot paint while ${phase}`);
            return;
        }
        io.to(lobbyCode).emit("update canvas", [...coords]);
    });
}
exports.default = handleRemotePaint;
//# sourceMappingURL=handleRemotePaint.js.map