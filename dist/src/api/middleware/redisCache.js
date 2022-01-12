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
const redis_1 = __importDefault(require("redis"));
const logger_1 = require("../../logger");
// provides basic access to a redis.creacteClient() instance
// see https://www.npmjs.com/package/redis
const REDIS_HOST = process.env.REDIS_HOST || "";
const REDIS_PORT = process.env.REDIS_PORT || "6379";
const DEFAULT_TTL = process.env.DEFAULT_TTL || "60";
const defaultOptions = {
    port: 6379,
    host: "localhost",
    options: {},
    name: "redis"
};
let getter;
let setter;
const clients = { getter, setter };
function redisOptions(port, host, options, name) {
    return {
        port: port || defaultOptions.port,
        host: host || defaultOptions.host,
        options: options || defaultOptions.options,
        name: name || defaultOptions.name
    };
}
/**
 *
 * @param port REDIS_PORT
 * @param host REDIS_HOST
 * @param options {}
 * @param name req.key_name
 * @returns Express Middleware
 */
function passOn(port, host, options, name) {
    const config = redisOptions(port, host, options, name);
    clients.getter = redis_1.default.createClient(config.port, config.host, options);
    clients.setter = clients.getter.duplicate();
    const keyname = config.name;
    /**
     * Express Middleware - Redis cache
     * @param req Request
     * @param res Response
     * @param next Next
     */
    const middleware = (req, res, next) => {
        if (clients.getter && clients.getter.connected) {
            // already connected,
            req[keyname] = cache;
            next();
        }
        else {
            // pass redisClient to req, once connected.
            if (clients.getter) {
                clients.getter.on("ready", () => {
                    req[keyname] = cache;
                    next();
                });
            }
        }
    };
    middleware.clients = clients;
    middleware.connect = (next) => {
        if (clients.getter && clients.getter.connected) {
            // if we're already connected
            clients.getter.once("end", () => {
                // reconnect after this connection ends
                clients.getter = redis_1.default.createClient(config.port, config.host, config.options);
                clients.setter = clients.getter.duplicate();
                // proceed with the new connection
                next();
            });
            // end current connection
            clients.getter.quit();
        }
        else {
            // create the connection
            clients.getter = redis_1.default.createClient(config.port, config.host, config.options);
            clients.setter = clients.getter.duplicate();
            // proceed
            next();
        }
    };
    middleware.disconnect = (next) => {
        if (clients.getter) {
            clients.getter.once("end", () => {
                clients.getter = undefined;
                clients.setter = undefined;
                next();
            });
            clients.getter.quit();
        }
        else {
            next();
        }
    };
    /**
     * set the value of name within Tricktionary cache
     * @param name keyname of value in cache
     * @param value string value
     * @param ttl number of seconds to retain this memory
     * @param cb Callback fn(err: any, value: any) => value
     * @returns void (use cb)
     */
    function setValue(name, value, ttl, cb) {
        var _a;
        const secondsToLive = ttl ? Number(ttl) : Number(DEFAULT_TTL);
        (0, logger_1.log)(`[cache] WRITE ${name} TTL ${secondsToLive}s`);
        const callBack = cb ? cb : redis_1.default.print;
        (_a = clients.setter) === null || _a === void 0 ? void 0 : _a.setex(name, secondsToLive, value, callBack);
    }
    /**
     * get the value of name from the Tricktionary cache
     * @param name keyname of value in cache
     * @param cb Callback fn(err: any, value: any) => value
     * @returns void (use cb)
     */
    function getValue(name, cb) {
        var _a, _b;
        return cb ? (_a = clients.getter) === null || _a === void 0 ? void 0 : _a.get(name, cb) : (_b = clients.getter) === null || _b === void 0 ? void 0 : _b.get(name);
    }
    function isConnected() {
        var _a;
        return ((_a = clients === null || clients === void 0 ? void 0 : clients.getter) === null || _a === void 0 ? void 0 : _a.connected) ? true : false;
    }
    function connect(next) {
        middleware.connect(next);
    }
    function disconnect(next) {
        middleware.disconnect(next);
    }
    function incValue(keyName, cb) {
        var _a;
        const callBack = cb || redis_1.default.print;
        (_a = clients === null || clients === void 0 ? void 0 : clients.setter) === null || _a === void 0 ? void 0 : _a.incr(keyName, callBack);
    }
    function findKeys(pattern, cb) {
        var _a;
        const callBack = cb || redis_1.default.print;
        (_a = clients === null || clients === void 0 ? void 0 : clients.getter) === null || _a === void 0 ? void 0 : _a.keys(pattern, callBack);
    }
    /**
     * create a callback function
     * @param key name of stored value
     * @param onReply function(value) => doSomethingWith(value)
     * @param onError function(err) => doSomethingWith(err)
     * @returns async function
     */
    function createCallback(key, onReply, onError) {
        const errFunc = onError ? onError : redis_1.default.print;
        return function (err, value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (value && !err) {
                    // ie. onReply(value)=> res.json({ value });
                    return yield onReply(value);
                }
                else {
                    (0, logger_1.log)(`[cache] ${key} not found!`);
                    return yield errFunc(err);
                }
            });
        };
    }
    const cache = {
        getValue,
        setValue,
        isConnected,
        connect,
        disconnect,
        incValue,
        findKeys,
        createCallback
    };
    middleware.cache = cache;
    return middleware;
}
/**
 * Express Middleware that does nothing
 * @param req Request
 * @param res Response
 * @param next Next
 */
const passOff = (req, res, next) => {
    req[defaultOptions.name] = undefined;
    next();
};
/**
 * Express Middleware, connects RedisClient w/ REDIS_HOST
 */
const redisCache = REDIS_HOST.length > 0
    ? passOn(Number(REDIS_PORT), REDIS_HOST, defaultOptions.options, defaultOptions.name)
    : passOff;
exports.default = redisCache;
//# sourceMappingURL=redisCache.js.map