// Run with `npm test` (Node's built-in runner on the compiled output).
//
// Two models start queries in a forEach without awaiting them. A failed query
// there reaches no handler, so it used to be an unhandled rejection, which
// stops the server; now each is logged. The knex instance is faked: each
// table name maps to the rows its query resolves with, or an error.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as dbConfig from "../../dbConfig";
import Super from "../admin/model";
import { bulkUpdate } from "../smash/model";

let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));

let logged: string[] = [];
const consoleLog = console.log;
const config = dbConfig as any;
const db = config.default;
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
 * fake knex: db(table).where(...)[.first()] resolves with tables[table], or,
 * when that is a function, with what it returns for the where clause
 */
function fakeDb(tables: { [table: string]: unknown }) {
  config.default = (table: string) => {
    let clause: any;
    const result = () => {
      const entry = tables[table];
      const rows = typeof entry === "function" ? entry(clause) : entry;
      // resolve later, as a real query does; the definitions lookups are the
      // slowest, so a caller that doesn't wait for them returns without them
      const delay = table === "definitions" ? 15 : 1;
      return new Promise((resolve, reject) =>
        setTimeout(() => (rows instanceof Error ? reject(rows) : resolve(rows)), delay)
      );
    };
    const query: any = {
      where: (w: any) => ((clause = w), query),
      first: () => result(),
      update: () => result(),
      then: (ok: any, fail: any) => result().then(ok, fail),
    };
    return query;
  };
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 40));

test("smash bulkUpdate: a failed write is logged, and the records are returned", async () => {
  fakeDb({ Smash: new Error("database is down") });
  const records = [
    { game_id: "g", round_id: 1, definition_id: 2, reaction_id: 3, value: 4 },
  ];
  const returned = await bulkUpdate(records, async (arr: any[]) => arr);
  await settle();
  assert.deepEqual(returned, records);
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("storing smash total") && l.includes("database is down")));
});

test("admin getWordDetails: a failed definitions lookup is logged", async () => {
  fakeDb({
    words: [{ id: 1 }],
    Rounds: [{ id: 5 }],
    definitions: new Error("database is down"),
    "host-choices": [],
  });
  const details: any = await Super.getWordDetails(1);
  await settle();
  assert.deepEqual(details.rounds_picked, [{ id: 5 }]);
  assert.deepEqual(details.definitions, []);
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("definitions of round 5: database is down")));
});

test("admin getWordDetails: the definitions of every round are in the reply", async () => {
  fakeDb({
    words: [{ id: 1 }],
    Rounds: [{ id: 5 }, { id: 6 }],
    definitions: (where: any) => [{ id: where.round_id * 10, round_id: where.round_id }],
    "host-choices": [],
  });
  const details: any = await Super.getWordDetails(1);
  assert.deepEqual(details.definitions, [
    { id: 50, round_id: 5 },
    { id: 60, round_id: 6 },
  ]);
  assert.deepEqual(escaped, []);
});

test("admin getWordDetails: one failed round leaves the others' definitions in", async () => {
  fakeDb({
    words: [{ id: 1 }],
    Rounds: [{ id: 5 }, { id: 6 }],
    definitions: (where: any) =>
      where.round_id === 5
        ? new Error("database is down")
        : [{ id: 60, round_id: 6 }],
    "host-choices": [],
  });
  const details: any = await Super.getWordDetails(1);
  assert.deepEqual(details.definitions, [{ id: 60, round_id: 6 }]);
  await settle();
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("definitions of round 5: database is down")));
});
