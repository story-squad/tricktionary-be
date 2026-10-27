// Run with `npm test` (Node's built-in runner on the compiled output).
//
// Redis failures are logged and answered, not thrown: an unreachable Redis
// doesn't stop the process or hold requests, and an error or bad value in a
// Redis callback (which runs outside the request's promise) still gets the
// request exactly one reply. No Redis or database needed: the cache below
// points at a closed port, and the models are faked.
import { test, beforeEach, afterEach, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { passOn } from "../redisCache";
import { sendReactions } from "../../reactions/routes";
import Reactions from "../../reactions/model";
// supertest ships without types; it is only called here
const request: any = require("supertest");

let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));
process.on("uncaughtException", (err) => escaped.push(err));

let logged: string[] = [];
const consoleLog = console.log;
let restore: (() => void)[] = [];
function fake(obj: any, name: string, fn: (...args: any[]) => any) {
  const original = obj[name];
  obj[name] = fn;
  restore.push(() => (obj[name] = original));
}
beforeEach(() => {
  escaped = [];
  logged = [];
  restore = [];
  console.log = (...args: any[]) => logged.push(args.join(" "));
});
afterEach(() => {
  console.log = consoleLog;
  restore.reverse().forEach((undo) => undo());
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 20));
const dbError = () => Promise.reject(new Error("database is down"));

// a cache whose Redis is unreachable (nothing listens on port 1); made in the
// first test, so its connection error is captured
let middleware: any;
after(() => {
  middleware.clients.getter?.end(false);
  middleware.clients.setter?.end(false);
});

// count res.json calls; mount `handler` with `cache` as req.redis
let sends = 0;
function appWith(cache: any, method: "get" | "put", path: string, handler: any) {
  sends = 0;
  const app = express();
  app.use(express.json());
  app.use((req: any, res, next) => {
    const json = res.json.bind(res);
    res.json = (body?: any) => {
      sends++;
      return json(body);
    };
    req.redis = cache;
    next();
  });
  app[method](path, handler);
  return app;
}

test("an unreachable Redis is logged, not thrown", async () => {
  middleware = passOn(1, "127.0.0.1", {}, "redis");
  // the client's first connection attempt fails right away
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert.deepEqual(escaped, []);
  assert.ok(
    logged.some((l) => /\[cache\] redis error: .*ECONNREFUSED/.test(l)),
    "expected the connection error in the log"
  );
});

test("while Redis is unreachable, requests go on without the cache", async () => {
  const req: any = {};
  let nexts = 0;
  middleware(req, {}, () => nexts++);
  assert.equal(nexts, 1, "next() should be called right away");
  assert.equal(req.redis, undefined);
});

// GET /api/reactions
const available = [{ id: 1, content: "x" }];
const reactionsCache = (getValue: any) => ({ getValue, setValue: () => {} });
for (const [name, getValue] of [
  ["the lookup fails", (key: string, cb: any) => cb(new Error("connection lost"))],
  ["the cached value is not JSON", (key: string, cb: any) => cb(null, "{not json")],
  ["the lookup throws", () => { throw new Error("client closed"); }],
] as const) {
  test(`GET /api/reactions: when ${name}, one reply from the database`, async () => {
    fake(Reactions, "getAll", () => Promise.resolve(available));
    const app = appWith(reactionsCache(getValue), "get", "/api/reactions", sendReactions);
    const res = await request(app).get("/api/reactions").timeout(2000);
    await flush();
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { available });
    assert.equal(sends, 1);
    assert.deepEqual(escaped, []);
  });
}

test("GET /api/reactions: a cached value is sent as is", async () => {
  fake(Reactions, "getAll", dbError);
  const cached = { available: [{ id: 2, content: "y" }] };
  const getValue = (key: string, cb: any) => cb(null, JSON.stringify(cached));
  const app = appWith(reactionsCache(getValue), "get", "/api/reactions", sendReactions);
  const res = await request(app).get("/api/reactions").timeout(2000);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, cached);
  assert.equal(sends, 1);
});
