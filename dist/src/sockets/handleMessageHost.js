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
/**
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param lobbies game-state
 * @param category what host should listen for
 * @param message information being sent to the host
 */
function handleMessageHost(io, socket, lobbies, category, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let ok = yield common_1.sendToHost(io, socket, lobbies, category, message);
        if (!ok) {
            common_1.privateMessage(io, socket, "error", "error sending message to host");
        }
    });
}
exports.default = handleMessageHost;
//# sourceMappingURL=handleMessageHost.js.map