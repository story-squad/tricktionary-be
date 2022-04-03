"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv = __importStar(require("dotenv"));
const boxMyText_1 = require("./boxMyText");
dotenv.config();
const withRedis = (_a = process.env.REDIS_HOST) === null || _a === void 0 ? void 0 : _a.length;
const withDB = (_b = process.env.DATABASE_URL) === null || _b === void 0 ? void 0 : _b.length;
const redisDetail = "asynchronyous io";
const dbDetail = "persistence";
let title = withDB ? "😎 " : "😈 ";
title += "Tricktionary API";
title += withRedis ? " 😎" : "";
const pad = 11;
if (!withDB) {
    console.log("warning: no DATABASE_URL was found.");
}
const PORT = process.env.PORT || 8080;
const server = app_1.socketApp.listen(PORT, () => {
    const { port, address } = server.address();
    const localAddress = `listening @ http://${address}${port ? `:${port}` : ""}`;
    let details = withRedis ? `w / ${redisDetail} & ` : "w / ";
    details += withDB ? dbDetail : "";
    console.log((0, boxMyText_1.boxMyText)(["", title, "", localAddress, "", `${details}`, ""], localAddress.length + pad));
});
//# sourceMappingURL=index.js.map