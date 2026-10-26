// Run with `npm test` (Node's built-in runner on the compiled output).
//
// An error thrown in a route handler, sync or async, becomes a 500 reply
// instead of an unhandled rejection that stops the server.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express, { Router } from "express";
import { forwardAsyncErrors, handleErrors } from "../asyncErrors";
// supertest ships without types; it is only called here
const request: any = require("supertest");

let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));
beforeEach(() => (escaped = []));
const flush = () => new Promise((resolve) => setImmediate(resolve));

function app() {
  const router = Router();
  router.get("/async-throw", async () => {
    throw new Error("database is down");
  });
  router.get("/sync-throw", () => {
    throw new Error("bad input");
  });
  router.get("/reply-then-throw", async (req, res) => {
    res.status(400).json({ error: "first reply" });
    throw new Error("thrown after replying");
  });
  router.get("/ok", async (req, res) => {
    res.json({ ok: true });
  });
  const api = express();
  api.use("/api", forwardAsyncErrors(router));
  api.use(handleErrors);
  return api;
}

test("an error thrown in an async handler becomes a 500", async () => {
  const res = await request(app()).get("/api/async-throw").timeout(2000);
  await flush();
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: "internal server error" });
  assert.deepEqual(escaped, []);
});

test("an error thrown in a sync handler becomes a 500", async () => {
  const res = await request(app()).get("/api/sync-throw");
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: "internal server error" });
});

test("an error after the reply keeps the reply and escapes nothing", async () => {
  const server = app();
  const res = await request(server).get("/api/reply-then-throw").timeout(2000);
  await flush();
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, { error: "first reply" });
  assert.deepEqual(escaped, []);
  // and the app goes on serving
  const next = await request(server).get("/api/ok");
  assert.deepEqual(next.body, { ok: true });
});

test("wrapping a router twice wraps its handlers once", () => {
  const router = Router();
  router.get("/x", async (req, res) => res.json({}));
  forwardAsyncErrors(router);
  const first = (router.stack[0] as any).route.stack[0].handle;
  forwardAsyncErrors(router);
  assert.equal((router.stack[0] as any).route.stack[0].handle, first);
});
