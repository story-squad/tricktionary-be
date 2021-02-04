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
function handleLoginAPI(io, socket, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const last_user_id = socket.id;
        let login;
        let data = token ? { last_user_id, last_token: token } : { last_user_id };
        try {
            login = yield common_1.localAxios.post('/api/auth/login', data);
            data = login.data;
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        common_1.privateMessage(io, socket, "token update", login.data);
    });
}
exports.default = handleLoginAPI;
//# sourceMappingURL=handleLoginAPI.js.map