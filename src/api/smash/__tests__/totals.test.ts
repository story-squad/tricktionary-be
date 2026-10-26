// Run with `npm test` (Node's built-in runner on the compiled output).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cacheGroupName } from "../model";
import smashRoutes from "../routes";
import {
  collectCachedTotals,
  createTotalsCollector,
  parseSmashKey,
  SmashTotal,
  validReactionCount,
} from "../totals";

const gameId = "6f1c2a52-0b8e-4d0f-9a43-1f2e3d4c5b6a";
const key = (reaction: number) => `${cacheGroupName}${gameId}-3-17-${reaction}`;

test("valid counts are kept as numbers", () => {
  assert.equal(validReactionCount("5"), 5);
  assert.equal(validReactionCount(1), 1);
});

test("nonnumeric counts are rejected", () => {
  assert.equal(validReactionCount("abc"), undefined);
  assert.equal(validReactionCount(NaN), undefined);
  assert.equal(validReactionCount(undefined), undefined);
});

test("nonpositive counts are rejected", () => {
  assert.equal(validReactionCount("0"), undefined);
  assert.equal(validReactionCount(0), undefined);
  assert.equal(validReactionCount("-2"), undefined);
});

test("a cache key splits into its ids, uuid dashes included", () => {
  assert.deepEqual(parseSmashKey(key(4)), {
    game_id: gameId,
    round_id: 3,
    definition_id: 17,
    reaction_id: 4,
  });
});

test("invalid counts are left out of the totals, and the totals still complete", async () => {
  const completed: SmashTotal[][] = [];
  const addTotal = createTotalsCollector(4, (queue) => {
    completed.push(queue);
  });
  await addTotal(key(1), "3");
  await addTotal(key(2), "not a number");
  await addTotal(key(3), "0");
  await addTotal(key(4), "-1");
  assert.equal(completed.length, 1);
  assert.deepEqual(completed[0], [
    {
      game_id: gameId,
      round_id: 3,
      definition_id: 17,
      reaction_id: 1,
      value: 3,
    },
  ]);
});

test("totals complete only once every key has been seen", async () => {
  let calls = 0;
  const addTotal = createTotalsCollector(2, () => {
    calls++;
  });
  await addTotal(key(1), "2");
  assert.equal(calls, 0);
  await addTotal(key(2), "7");
  assert.equal(calls, 1);
});

// a cache holding these values; findKeys fails when keysError is given
function fakeCache(values: Record<string, unknown>, keysError?: Error) {
  return {
    findKeys: (pattern: string, cb: any) =>
      cb(keysError || null, keysError ? undefined : Object.keys(values)),
    getValue: (keyName: string, cb: any) => cb(null, values[keyName] ?? null),
    // the cache's own callback helper, as redisCache builds it
    createCallback: (key: string, onReply: any, onError?: any) =>
      async (err: any, value: any) =>
        value && !err ? onReply(value) : onError?.(err),
  };
}

test("no cached keys gives an empty list of totals, once", () => {
  const results: unknown[] = [];
  collectCachedTotals(
    fakeCache({}),
    "pattern",
    (queue) => results.push(queue),
    (err) => results.push(err)
  );
  assert.deepEqual(results, [[]]);
});

test("a failed key lookup calls onError once", () => {
  const totals: unknown[] = [];
  const errors: unknown[] = [];
  collectCachedTotals(
    fakeCache({}, new Error("redis down")),
    "pattern",
    (queue) => totals.push(queue),
    (err) => errors.push(err)
  );
  assert.equal(totals.length, 0);
  assert.equal(errors.length, 1);
});

test("a key whose value is gone is left out, and the totals still complete", async () => {
  const results: SmashTotal[][] = [];
  collectCachedTotals(
    fakeCache({ [key(1)]: "2", [key(2)]: null }),
    "pattern",
    (queue) => results.push(queue),
    () => assert.fail("no error expected")
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(results.length, 1);
  assert.deepEqual(
    results[0].map((t) => t.reaction_id),
    [1]
  );
});

// GET /api/smash/totals/:game_id/:round_id, called with a cache on req.redis
async function getTotalsWith(cache: any) {
  const layer: any = smashRoutes.stack.find(
    (l: any) => l.route?.path === "/totals/:game_id/:round_id"
  );
  const handlers = layer.route.stack;
  const handler = handlers[handlers.length - 1].handle;
  const replies: { status: number; body: unknown }[] = [];
  const res: any = {
    headersSent: false,
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      if (this.headersSent) throw new Error("ERR_HTTP_HEADERS_SENT");
      this.headersSent = true;
      replies.push({ status: this.statusCode, body });
      return this;
    },
  };
  const req = { redis: cache, params: { game_id: gameId, round_id: "3" } };
  await handler(req, res, () => {});
  // let the cache callbacks run
  for (let i = 0; i < 5; i++) await new Promise((r) => setImmediate(r));
  return replies;
}

test("/totals replies once with an empty list when the round has no cached keys", async () => {
  assert.deepEqual(await getTotalsWith(fakeCache({})), [
    { status: 200, body: [] },
  ]);
});

test("/totals replies once with an error when the key lookup fails", async () => {
  const replies = await getTotalsWith(fakeCache({}, new Error("redis down")));
  assert.deepEqual(replies, [{ status: 400, body: { error: "redis down" } }]);
});

test("/totals replies once when a cached value is gone", async () => {
  assert.deepEqual(await getTotalsWith(fakeCache({ [key(1)]: null })), [
    { status: 200, body: [] },
  ]);
});
