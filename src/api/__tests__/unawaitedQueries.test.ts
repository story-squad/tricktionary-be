// Run with `npm test` (Node's built-in runner on the compiled output).
//
// getWordDetails (admin model) looks up the definitions of each round. The
// lookups used to run in a forEach without being awaited, so the reply
// usually had no definitions, and a failed lookup was an unhandled rejection,
// which stops the server. Now the reply waits for them, and a failed one is
// logged. Also: getRound, getDefinitionDetails and getTopVotedDefinitions
// read the definitions table by its current name. The knex instance is faked:
// each table name maps to the rows its query resolves with, or an error.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as dbConfig from "../../dbConfig";
import Super from "../admin/model";

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
 * when that is a function, with what it returns for the where clause (.first()
 * with the first row). A table not listed fails as Postgres does for a table
 * that doesn't exist.
 */
function fakeDb(tables: { [table: string]: unknown }) {
  config.default = (table: string) => {
    let clause: any;
    const result = () => {
      const entry =
        table in tables
          ? tables[table]
          : new Error(`relation "${table}" does not exist`);
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
      first: () => result().then((r: any) => (Array.isArray(r) ? r[0] : r)),
      update: () => result(),
      then: (ok: any, fail: any) => result().then(ok, fail),
    };
    return query;
  };
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 40));

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

// The definitions table is "definitions" (renamed from "Definitions" by the
// 20210325 migration); the other admin lookups still asked for "Definitions".
const roundTables = {
  definitions: (where: any) =>
    [{ id: 50, round_id: 5 }, { id: 51, round_id: 5 }].filter(
      (d) => where === undefined || d.id === where.id || d.round_id === where.round_id
    ),
  "Definition-Reactions": [],
  "User-Rounds": [],
  Votes: (where: any) => (where.definition_id === 51 ? [{ id: 1 }, { id: 2 }] : []),
  Rounds: { id: 5, word_id: 1, number_players: 3 },
  words: { id: 1 },
  "host-choices": {},
};

test("admin getRound: reads the round's definitions", async () => {
  fakeDb(roundTables);
  const round: any = await Super.getRound(5);
  assert.deepEqual(
    round.definitions.map((d: any) => d.id),
    [50, 51]
  );
});

test("admin getDefinitionDetails: reads the definition", async () => {
  fakeDb(roundTables);
  const details: any = await Super.getDefinitionDetails(51);
  assert.deepEqual(details.definition, { id: 51, round_id: 5 });
  assert.equal(details.votes.length, 2);
  assert.equal(details.num_players, 3);
});

test("admin getTopVotedDefinitions: lists the voted definitions", async () => {
  fakeDb(roundTables);
  const top: any[] = await Super.getTopVotedDefinitions();
  assert.equal(top.length, 1);
  assert.equal(top[0].votes.length, 2);
});
