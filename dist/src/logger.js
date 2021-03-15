"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const startTime = Date.now();
function getLogFilePaths() {
    const filename = process.env.LOGFILE
        ? `${startTime}-${process.env.LOGFILE}`
        : `${startTime}-tricktionary.log`;
    const foldername = process.env.LOGFOLDER ? process.env.LOGFOLDER : ".";
    const paths = [foldername, filename];
    const result = path_1.default.resolve(path_1.default.join(...paths));
    return result;
}
if (process.env.WRITELOG) {
    console.log("logging to ", getLogFilePaths());
}
/**
 * write to log file when
 * WRITELOG=1
 *
 * @param entry message
 */
const log = function (entry) {
    const message = `${new Date().toISOString()} - ${entry}\n`;
    if (process.env.WRITELOG === "1") {
        try {
            fs_1.default.appendFileSync(getLogFilePaths(), message);
        }
        catch (err) {
            console.log(message);
        }
    }
    else {
        console.log(message);
    }
};
exports.log = log;
//# sourceMappingURL=logger.js.map