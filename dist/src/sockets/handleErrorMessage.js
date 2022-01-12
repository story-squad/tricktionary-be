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
const logger_1 = require("../logger");
/**
 * emit "error" message to player at socket.id
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param error string
 */
function handleErrorMessage(io, socket, code, error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            io.to(socket.id).emit("error", code, error);
        }
        catch (err) {
            (0, logger_1.log)("catch (handleErrorMessage)");
            if (err instanceof Error)
                (0, logger_1.log)(err.message);
        }
    });
}
exports.default = handleErrorMessage;
//# sourceMappingURL=handleErrorMessage.js.map