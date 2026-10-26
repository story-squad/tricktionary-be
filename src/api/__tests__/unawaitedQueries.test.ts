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

/** fake knex: db(table).where(...)[.first()] resolves with tables[table] */
function fakeDb(tables: { [table: string]: unknown }) {
  config.default = (table: string) => {
    const result = () =>
      tables[table] instanceof Error
        ? Promise.reject(tables[table])
        : Promise.resolve(tables[table]);
    const query: any = {
      where: () => query,
      first: () => result(),
      update: () => result(),
      then: (ok: any, fail: any) => result().then(ok, fail),
    };
    return query;
  };
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

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
    Definitions: new Error("database is down"),
    "host-choices": [],
  });
  const details: any = await Super.getWordDetails(1);
  await settle();
  assert.deepEqual(details.rounds_picked, [{ id: 5 }]);
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("definitions of round 5: database is down")));
});
