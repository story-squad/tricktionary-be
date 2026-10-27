// Run with `npm test` (Node's built-in runner on the compiled output).
import { test } from "node:test";
import assert from "node:assert/strict";
import { serializeByKey } from "../serializeByKey";

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

test("tasks under one key never overlap", async () => {
  const lobby: string[] = [];
  // a join that checks membership, awaits (like the new-player request),
  // then appends: two of these overlapping is the duplicate-player bug
  const join = (id: string) => async () => {
    if (lobby.includes(id)) return;
    await tick();
    lobby.push(id);
  };
  await Promise.all([
    serializeByKey("socket-a", join("socket-a")),
    serializeByKey("socket-a", join("socket-a")),
  ]);
  assert.deepEqual(lobby, ["socket-a"]);
});

test("different keys still run concurrently", async () => {
  const order: string[] = [];
  await Promise.all([
    serializeByKey("a", async () => {
      order.push("a start");
      await tick();
      order.push("a end");
    }),
    serializeByKey("b", async () => {
      order.push("b start");
      await tick();
      order.push("b end");
    }),
  ]);
  assert.deepEqual(order.slice(0, 2), ["a start", "b start"]);
});

test("a failed task doesn't block the next one", async () => {
  const failed = serializeByKey("c", async () => {
    throw new Error("boom");
  });
  await assert.rejects(failed);
  assert.equal(await serializeByKey("c", async () => "ok"), "ok");
});
