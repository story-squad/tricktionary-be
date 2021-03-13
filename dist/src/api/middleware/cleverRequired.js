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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode64 = exports.encode64 = exports.cleverBearer = exports.cleverBasic = exports.cleverStudentRequired = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../logger");
// encode a string in Base64
const encode64 = (str) => Buffer.from(str, "binary").toString("base64");
exports.encode64 = encode64;
// decode a string from Base64
const decode64 = (str) => Buffer.from(str, "base64").toString("binary");
exports.decode64 = decode64;
/**
 * Auth Basic
 * @param clientID Clever API client id
 * @param clientSecret Clever API client secret
 */
const cleverBasic = (clientID, clientSecret) => axios_1.default.create({
    baseURL: `${process.env.CLEVER_BASE_URL}}`,
    headers: {
        Authorization: `Basic ${encode64(`${clientID}:${clientSecret}`)}`,
        "Content-Type": "application/json"
    }
});
exports.cleverBasic = cleverBasic;
/**
 * Auth Bearer
 * @param token Student Token
 * @returns an instance of axios with baseURL & headers set accordingly.
 */
const cleverBearer = (token) => axios_1.default.create({
    baseURL: `${process.env.CLEVER_BASE_URL}`,
    headers: {
        Authorization: `Bearer ${token}`,
    }
});
exports.cleverBearer = cleverBearer;
/**
 * verify your Clever student, teacher, or Admin
 *
 * WORKS with identites:
 *
 *   ilc_DEMO_STUDENT_TOKEN
 *
 *   ilc_DEMO_TEACHER_TOKEN
 *
 *   ilc_DEMO_SCHOOL_ADMIN_TOKEN
 *
 * reference: https://dev.clever.com/reference#clevercomoauthtokeninfo
 */
const cleverStudentRequired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // log(`middleware for ${process.env.CLEVER_BASE_URL}`);
    try {
        // parse header
        const authHeader = req.headers.authorization || "";
        const match = authHeader.match(/Bearer (.+)/);
        if (!match)
            throw new Error("Missing student id");
        const studentID = match[1];
        const result = yield cleverBearer(studentID.trim()).get("/oauth/tokeninfo");
        logger_1.log(`status : ${result.status}`);
        // check status
        if (result.status !== 200)
            throw new Error("error verifying student");
        // attach result
        req.tokenInfo = result.data;
        logger_1.log('success!');
        // continue
        next();
    }
    catch (err) {
        next(http_errors_1.default(401, err.message));
    }
});
exports.cleverStudentRequired = cleverStudentRequired;
//# sourceMappingURL=cleverRequired.js.map