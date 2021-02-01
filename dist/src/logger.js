"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const log = function (entry) {
    fs_1.default.appendFileSync('/tmp/trixie.log', `${new Date().toISOString()} - ${entry}\n`);
};
exports.log = log;
//# sourceMappingURL=logger.js.map