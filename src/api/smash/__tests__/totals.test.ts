// Run with `npm test` (Node's built-in runner on the compiled output).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cacheGroupName } from "../model";
import {
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
