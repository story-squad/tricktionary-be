"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const paths = [process.env.LOGFOLDER || ".", process.env.LOGFILE || "tricktionary.log"];
const LOGFILE = path_1.default.resolve(path_1.default.join(...paths));
console.log('logging to ', LOGFILE);
/**
 * write to log file.
 *
 * @param entry message
 */
const log = function (entry) {
    fs_1.default.appendFileSync(LOGFILE, `${new Date().toISOString()} - ${entry}\n`);
};
exports.log = log;
//# sourceMappingURL=logger.js.map