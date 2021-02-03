"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.playerIsHost = exports.privateMessage = exports.fortune = exports.localAxios = exports.LC_LENGTH = void 0;
// import * as dotenv from "dotenv";
// import util from "util";
// import { exec as cmd } from "child_process";
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const localAxios = axios_1.default.create({
    baseURL: `${process.env.BASE_URL || "http://0.0.0.0"}:${process.env.PORT || 5000}`
});
exports.localAxios = localAxios;
localAxios.defaults.timeout = 10000;
const LC_LENGTH = 4; // number of characters in lobbyCode
exports.LC_LENGTH = LC_LENGTH;
// const exec = util.promisify(cmd);
function fortune() {
    return __awaiter(this, void 0, void 0, function* () {
        // returns a promise
        // const { stdout, stderr } = await exec("fortune");
        // return { fortune: stdout, error: stderr };
        return { fortune: "coming soon?" };
    });
}
exports.fortune = fortune;
/**
 * send message to socket.id
 *
 * @param io any (socketio)
 * @param socket any (socketio)
 * @param listener string
 * @param message string
 *
 * helper function; not directly exposed to the public.
 *
 * please handle all necessary authority role checks, prior to invocation.
 */
function privateMessage(io, socket, listener, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pid = socket.id;
            io.to(pid).emit(listener, message); // private message player
            console.log(`${listener} message -> ${socket.id}`);
        }
        catch (err) {
            console.log({ [listener]: message });
        }
    });
}
exports.privateMessage = privateMessage;
function playerIsHost(socket, lobbyCode, lobbies) {
    try {
        const ok = lobbies[lobbyCode].host === socket.id;
        return { ok };
    }
    catch (err) {
        return { ok: false, message: err };
    }
}
exports.playerIsHost = playerIsHost;
//# sourceMappingURL=common.js.map