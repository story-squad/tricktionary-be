// Run with `npm test` (Node's built-in runner on the compiled output).
//
// Reaction totals come from the Smash table, the record, whether or not Redis
// is up. Before, a reaction was counted in Redis when it was up and in
// Postgres when it was down, and /api/smash/totals read Redis, so reactions
// counted during an outage were missing from the totals once Redis was back.
// The knex instance is faked by an in-memory Smash table; the cache on
// req.redis is an in-memory stand-in for Redis (the routes no longer use it).
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as dbConfig from "../../../dbConfig";
import smashRoutes, { smashEmoji } from "../routes";

let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));

const config = dbConfig as any;
const db = config.default;
let logged: string[] = [];
const consoleLog = console.log;
beforeEach(() => {
  escaped = [];
  logged = [];
  console.log = (...args: any[]) => logged.push(args.join(" "));
});
afterEach(() => {
  console.log = consoleLog;
  config.default = db;
});

/**
 * fake knex over an in-memory table: where, first, orderBy, returning,
 * insert, increment, update and then, plus transaction and raw. Each query
 * resolves on a later turn, as a real one does.
 */
function fakeDb(rows: any[], fail?: Error) {
  let nextId = rows.length + 1;
  const matches = (where: any) => (row: any) =>
    Object.entries(where).every(([k, v]) => row[k] == v);
  const table: any = (name: string) => {
    const where: any = {};
    let single = false;
    let op = "select";
    let data: any;
    let by = 1;
    const run = () => {
      if (fail) throw fail;
      const hit = rows.filter(matches(where));
      if (op === "insert") {
        const row = { id: nextId++, ...data };
        rows.push(row);
        return [row];
      }
      if (op === "increment") {
        hit.forEach((r) => (r.count += by));
        return hit;
      }
      if (op === "update") {
        hit.forEach((r) => Object.assign(r, data));
        return hit.length;
      }
      const copies = hit.map((r) => ({ ...r }));
      return single ? copies[0] : copies;
    };
    const query: any = {
      where: (w: any) => (Object.assign(where, w), query),
      first: () => ((single = true), query),
      orderBy: () => query,
      returning: () => query,
      insert: (d: any) => ((op = "insert"), (data = d), query),
      increment: (_column: string, n = 1) => ((op = "increment"), (by = n), query),
      update: (d: any) => ((op = "update"), (data = d), query),
      then: (ok: any, bad: any) =>
        new Promise((r) => setImmediate(r)).then(run).then(ok, bad),
    };
    return query;
  };
  table.raw = () => Promise.resolve();
  table.transaction = async (work: any) => work(table);
  config.default = table;
}

/** an in-memory stand-in for the Redis cache the routes used to count in */
function fakeCache() {
  const store: { [key: string]: number } = {};
  return {
    incValue: (key: string, cb: any) =>
      setImmediate(() => cb(null, (store[key] = (store[key] || 0) + 1))),
    findKeys: (pattern: string, cb: any) =>
      setImmediate(() =>
        cb(null, Object.keys(store).filter((k) => k.startsWith(pattern.replace("*", ""))))
      ),
    getValue: (key: string, cb: any) => setImmediate(() => cb(null, String(store[key]))),
    createCallback: (key: string, onReply: any, onError: any) =>
      async (err: any, value: any) => (value && !err ? onReply(value) : onError(err)),
  };
}

function fakeRes(replies: { status: number; body: any }[]) {
  return {
    headersSent: false,
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: any) {
      if (this.headersSent) throw new Error("ERR_HTTP_HEADERS_SENT");
      this.headersSent = true;
      replies.push({ status: this.statusCode, body });
      return this;
    },
  };
}
const settle = async () => {
  for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r));
};

const gameId = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

/** PUT /api/smash/emoji/:lobbyCode, with `cache` on req.redis (undefined: Redis down) */
async function react(cache: any, definitionId: number, reactionId: number) {
  const replies: { status: number; body: any }[] = [];
  const req = {
    redis: cache,
    params: { lobbyCode: "ABCD" },
    body: { game_id: gameId, roundId: 3, definitionId, reactionId },
  };
  await smashEmoji(req, fakeRes(replies));
  await settle();
  assert.equal(replies.length, 1, "one reply");
  return replies[0];
}

/** GET /api/smash/totals/:game_id/:round_id, with `cache` on req.redis */
async function totals(cache: any) {
  const layer: any = smashRoutes.stack.find(
    (l: any) => l.route?.path === "/totals/:game_id/:round_id"
  );
  const handlers = layer.route.stack;
  const handler = handlers[handlers.length - 1].handle;
  const replies: { status: number; body: any }[] = [];
  const req = { redis: cache, params: { game_id: gameId, round_id: "3" } };
  await handler(req, fakeRes(replies), () => {});
  await settle();
  assert.equal(replies.length, 1, "one reply");
  return replies[0];
}

/** the fields the totals reply had with Redis up, sorted by definition, reaction */
const asBefore = (body: any[]) =>
  body
    .map(({ game_id, round_id, definition_id, reaction_id, value }) => ({
      game_id,
      round_id,
      definition_id,
      reaction_id,
      value,
    }))
    .sort((a, b) => a.definition_id - b.definition_id || a.reaction_id - b.reaction_id);
const total = (definition_id: number, reaction_id: number, value: number) => ({
  game_id: gameId,
  round_id: 3,
  definition_id,
  reaction_id,
  value,
});

test("normal play: each reaction replies with its running count, and the totals are the counts", async () => {
  fakeDb([]);
  const cache = fakeCache();
  const values = [];
  for (let i = 0; i < 3; i++) values.push((await react(cache, 2, 8)).body.value);
  values.push((await react(cache, 2, 13)).body.value);
  values.push((await react(cache, 5, 8)).body.value);
  assert.deepEqual(values, [1, 2, 3, 1, 1]);
  const reply = await totals(cache);
  assert.equal(reply.status, 200);
  assert.deepEqual(asBefore(reply.body), [total(2, 8, 3), total(2, 13, 1), total(5, 8, 1)]);
  assert.deepEqual(escaped, []);
});

test("reactions counted while Redis is down are in the totals after it comes back", async () => {
  fakeDb([]);
  const cache = fakeCache();
  await react(cache, 2, 8);
  await react(cache, 2, 8);
  await react(cache, 2, 13);
  // Redis goes down: the middleware sets req.redis to undefined
  assert.equal((await react(undefined, 2, 8)).body.value, 3);
  await react(undefined, 5, 8);
  // Redis is back
  assert.equal((await react(cache, 2, 8)).body.value, 4);
  const reply = await totals(cache);
  assert.equal(reply.status, 200);
  assert.deepEqual(asBefore(reply.body), [total(2, 8, 4), total(2, 13, 1), total(5, 8, 1)]);
  assert.deepEqual(escaped, []);
});

test("totals carry each count as `count` too, the field the front end reads", async () => {
  fakeDb([]);
  await react(undefined, 2, 8);
  await react(undefined, 2, 8);
  const reply = await totals(undefined);
  assert.deepEqual(reply.body, [{ ...total(2, 8, 2), count: 2 }]);
});

test("when rows repeat a reaction, its total is the largest count", async () => {
  // the earlier cache-to-database copy could write a total twice
  const key = { game_id: gameId, round_id: 3, definition_id: 2, reaction_id: 8 };
  fakeDb([
    { id: 1, ...key, count: 3 },
    { id: 2, ...key, count: 3 },
    { id: 3, ...key, count: 1 },
  ]);
  const reply = await totals(undefined);
  assert.deepEqual(reply.body, [{ ...total(2, 8, 3), count: 3 }]);
});

test("a round with no reactions has empty totals", async () => {
  fakeDb([]);
  assert.deepEqual(await totals(undefined), { status: 200, body: [] });
});

test("a failed database read replies once with 400", async () => {
  fakeDb([], new Error("database is down"));
  assert.deepEqual(await totals(undefined), {
    status: 400,
    body: { error: "database is down" },
  });
  assert.deepEqual(escaped, []);
});

test("a failed database write replies once with 400", async () => {
  fakeDb([], new Error("database is down"));
  assert.deepEqual(await react(undefined, 2, 8), {
    status: 400,
    body: { error: "database is down" },
  });
  assert.deepEqual(escaped, []);
});

test("a reaction without a game id replies once with the error", async () => {
  fakeDb([]);
  const replies: { status: number; body: any }[] = [];
  const req = { params: { lobbyCode: "ABCD" }, body: { roundId: 3, definitionId: 2, reactionId: 8 } };
  await smashEmoji(req, fakeRes(replies));
  assert.equal(replies.length, 1);
  assert.match(replies[0].body.error, /game_id undefined/);
});
