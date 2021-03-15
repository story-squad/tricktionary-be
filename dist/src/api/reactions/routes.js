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
const express_1 = require("express");
const middleware_1 = require("../middleware");
const util_1 = require("./util");
const logger_1 = require("../../logger");
const router = express_1.Router();
/**
 * request all from the database table "Reactions"
 * @param req Request object
 * @param res Resonse object
 * @returns
 */
function sendFromDatabase(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reply = yield util_1.getDatabaseReactions(req.redis);
        return res.json(reply);
    });
}
router.get("/", middleware_1.redisCache, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cache = req.redis;
    // no redis ?
    if (!(cache === null || cache === void 0 ? void 0 : cache.getValue)) {
        // not connected to redis
        try {
            yield sendFromDatabase(req, res);
        }
        catch (err) {
            return res
                .status(400)
                .json({ error: err.message || "database lookup error" });
        }
    }
    else {
        // with redis
        try {
            yield cache.getValue("tricktionary-reactions", function (err, value) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (value && !err) {
                        return res.json(JSON.parse(value));
                    }
                    else {
                        logger_1.log("tricktionary-reactions were not found in the cache => sendFromDatabase");
                        // database
                        yield sendFromDatabase(req, res);
                    }
                });
            });
        }
        catch (err) {
            logger_1.log((err === null || err === void 0 ? void 0 : err.message) || err);
            next();
        }
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map