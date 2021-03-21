import redis from "redis";
import { log } from "../../logger";
// provides basic access to a redis.creacteClient() instance
// see https://www.npmjs.com/package/redis
const REDIS_HOST: string = process.env.REDIS_HOST || "";
const REDIS_PORT: string = process.env.REDIS_PORT || "6379";
const DEFAULT_TTL: string = process.env.DEFAULT_TTL || "60";

export type TricktionaryCache = {
  getValue: any;
  setValue: any;
  isConnected: any;
  connect: any;
  disconnect: any;
  incValue: any;
  findKeys: any;
  createCallback: any;
};

interface rOptions {
  port: number;
  host: string;
  options: any;
  name: string;
}

const defaultOptions: rOptions = {
  port: 6379,
  host: "localhost",
  options: {},
  name: "redis"
};

interface rClients {
  getter: redis.RedisClient | undefined;
  setter: redis.RedisClient | undefined;
  [key: string]: any;
}

let getter: redis.RedisClient | undefined;
let setter: redis.RedisClient | undefined;

const clients: rClients = { getter, setter };

function redisOptions(port: any, host: any, options: any, name: any) {
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
function passOn(port: number, host: string, options: any, name: string) {
  const config = redisOptions(port, host, options, name);
  clients.getter = redis.createClient(config.port, config.host, options);
  clients.setter = clients.getter.duplicate();
  const keyname: string = config.name;
  /**
   * Express Middleware - Redis cache
   * @param req Request
   * @param res Response
   * @param next Next
   */
  const middleware = (req: any, res: any, next: any) => {
    if (clients.getter && clients.getter.connected) {
      // already connected,
      req[keyname] = cache;
      next();
    } else {
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
  middleware.connect = (next: any) => {
    if (clients.getter && clients.getter.connected) {
      // if we're already connected
      clients.getter.once("end", () => {
        // reconnect after this connection ends
        clients.getter = redis.createClient(
          config.port,
          config.host,
          config.options
        );
        clients.setter = clients.getter.duplicate();
        // proceed with the new connection
        next();
      });
      // end current connection
      clients.getter.quit();
    } else {
      // create the connection
      clients.getter = redis.createClient(
        config.port,
        config.host,
        config.options
      );
      clients.setter = clients.getter.duplicate();
      // proceed
      next();
    }
  };
  middleware.disconnect = (next: any) => {
    if (clients.getter) {
      clients.getter.once("end", () => {
        clients.getter = undefined;
        clients.setter = undefined;
        next();
      });
      clients.getter.quit();
    } else {
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
  function setValue(name: string, value: string, ttl?: any, cb?: any): void {
    const secondsToLive: number = ttl ? Number(ttl) : Number(DEFAULT_TTL);
    log(`[cache] WRITE ${name} TTL ${secondsToLive}s`);
    const callBack = cb ? cb : redis.print;
    clients.setter?.setex(name, secondsToLive, value, callBack);
  }

  /**
   * get the value of name from the Tricktionary cache
   * @param name keyname of value in cache
   * @param cb Callback fn(err: any, value: any) => value
   * @returns void (use cb)
   */
  function getValue(name: string, cb?: any) {
    return cb ? clients.getter?.get(name, cb) : clients.getter?.get(name);
  }

  function isConnected(): boolean {
    return clients?.getter?.connected ? true : false;
  }

  function connect(next: any): void {
    middleware.connect(next);
  }

  function disconnect(next: any): void {
    middleware.disconnect(next);
  }

  function incValue(keyName: string, cb?: any) {
    const callBack = cb || redis.print;
    clients?.setter?.incr(keyName, callBack);
  }
  function findKeys(pattern: string, cb?: any) {
    const callBack = cb || redis.print;
    clients?.getter?.keys(pattern, callBack);
  }

  /**
   * create a callback function
   * @param key name of stored value
   * @param onReply function(value) => doSomethingWith(value)
   * @param onError function(err) => doSomethingWith(err)
   * @returns async function
   */
  function createCallback(key: string, onReply: any, onError?: any) {
    const errFunc = onError ? onError : redis.print;
    return async function (err: any, value: any) {
      if (value && !err) {
        // ie. onReply(value)=> res.json({ value });
        return await onReply(value);
      } else {
        log(`[cache] ${key} not found!`);
        return await errFunc(err);
      }
    };
  }

  const cache: TricktionaryCache = {
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
const passOff = (req: any, res: any, next: any) => {
  req[defaultOptions.name] = undefined;
  next();
};

/**
 * Express Middleware, connects RedisClient w/ REDIS_HOST
 */
const redisCache =
  REDIS_HOST.length > 0
    ? passOn(
        Number(REDIS_PORT),
        REDIS_HOST,
        defaultOptions.options,
        defaultOptions.name
      )
    : passOff;

export default redisCache;
