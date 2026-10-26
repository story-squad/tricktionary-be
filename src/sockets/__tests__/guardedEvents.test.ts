// Run with `npm test` (Node's built-in runner on the compiled output).
//
// An error in a socket event handler is logged, not left to stop the server.
// socket.io ignores what a listener returns, so without the guard a throw is
// an uncaught exception and a rejection an unhandled rejection. Also covers
// promises the handlers start without awaiting (score updates, score cards),
// which no guard can see. socket.io and localAxios are faked; no server or
// database needed.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { localAxios, startNewRound } from "../common";
import { registerGameEvents } from "../events";
import { guardHandler } from "../guardHandler";
import { handleArrayOfGuesses } from "../handleGuess";
import { checkPulse, lobbyTasks, schedulePulseCheck } from "../crontab";

let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));
process.on("uncaughtException", (err) => escaped.push(err));

let logged: string[] = [];
const consoleLog = console.log;
const api = localAxios as any;
const original = { get: api.get, post: api.post, put: api.put };
beforeEach(() => {
  escaped = [];
  logged = [];
  console.log = (...args: any[]) => logged.push(args.join(" "));
});
afterEach(() => {
  console.log = consoleLog;
  Object.assign(api, original);
});

const settle = () => new Promise((resolve) => setTimeout(resolve, 20));
const reply = (data: any, status = 200) => Promise.resolve({ data, status });
const refused = () => Promise.reject(new Error("connect ECONNREFUSED"));
const io = { to: () => ({ emit: () => {} }) };

function connect(id: string, rooms: string[] = []) {
  const socket: any = new EventEmitter();
  socket.id = id;
  socket.rooms = new Set([id, ...rooms]);
  socket.join = (room: string) => socket.rooms.add(room);
  socket.leave = (room: string) => socket.rooms.delete(room);
  return socket;
}

test("guardHandler logs a throw and a rejection, and passes arguments", async () => {
  const socket = { id: "s1" };
  const seen: any[] = [];
  guardHandler("sync", socket, () => {
    throw new Error("bad input");
  })();
  guardHandler("async", socket, async () => {
    throw new Error("database is down");
  })();
  guardHandler("ok", socket, (a: number, b: string) => seen.push(a, b))(1, "x");
  await settle();
  assert.deepEqual(escaped, []);
  assert.deepEqual(seen, [1, "x"]);
  assert.ok(logged.some((l) => l.includes('[ERROR] socket event "sync" from s1: bad input')));
  assert.ok(logged.some((l) => l.includes('[ERROR] socket event "async" from s1: database is down')));
});

// malformed events, each of which used to stop the server
const malformed: [string, any[], any][] = [
  ["join lobby", ["player", 1234], {}], // a lobby code that is not a string
  ["definition submitted", ["a definition", "ZZZZ"], {}], // no such lobby
  ["guess", ["ZZZZ", []], {}],
  ["set finale", ["ZZZZ"], {}],
  ["remote paint", [null], {}],
  // a disconnect from a lobby that doesn't list this player
  ["disconnecting", [], { ZZZZ: { players: [{ id: "other" }] } }],
];
for (const [event, args, lobbies] of malformed) {
  test(`socket "${event}" with bad input: logged, nothing escapes`, async () => {
    api.get = () => reply({});
    api.post = () => reply({});
    const socket = connect("s1", ["ZZZZ"]);
    registerGameEvents(io, socket, lobbies);
    socket.emit(event, ...args);
    await settle();
    assert.deepEqual(escaped, []);
    assert.ok(
      logged.some((l) => l.includes(`[ERROR] socket event "${event}" from s1`)),
      `expected the error of "${event}" in the log`
    );
  });
}

test('socket "login": an error in the returning player\'s rejoin reaches the guard', async () => {
  api.post = (url: string) =>
    url === "/api/auth/login"
      ? reply({ token: "t", player: { name: "P", last_played: "ABCD" }, old_user_id: "old" })
      : reply({});
  api.get = () => reply({});
  const socket = connect("s1");
  delete socket.rooms; // makes the rejoin fail
  registerGameEvents(io, socket, { ABCD: { players: [], host: "h" } });
  socket.emit("login", "old-token");
  await settle();
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes('[ERROR] socket event "login" from s1')));
});

test("a failed score update while scoring guesses is logged, and the round ends", async () => {
  const puts: string[] = [];
  api.post = () => reply({ ok: true });
  api.put = (url: string) => {
    puts.push(url);
    return refused();
  };
  const lobbies: any = {
    ABCD: {
      roundId: 1,
      game_id: "game-1",
      players: [{ id: "s1", pid: "p1", username: "P", points: 0 }],
      rounds: [{ roundNum: "1", scores: [{ playerId: "s1", playerPID: "p1", score: 0 }] }],
    },
  };
  await handleArrayOfGuesses(io, connect("host"), "ABCD", lobbies, [{ player: "s1", guess: 0 }]);
  await settle();
  assert.deepEqual(puts, ["/api/score/increase/p1"]);
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("scoring P, connect ECONNREFUSED")));
  assert.equal(lobbies.ABCD.phase, "POSTGAME");
});

test("a failed score card lookup at round start is logged, and the round starts", async () => {
  api.get = refused;
  api.post = (url: string) =>
    url === "/api/round/start" ? reply({ roundId: 7 }) : reply({ ok: true }, 201);
  const lobbies: any = {
    ABCD: { game_id: "game-1", players: [{ id: "s1", pid: "p1", username: "P" }] },
  };
  const result: any = await startNewRound(
    "s1",
    { id: 1, word: "w", definition: "d" },
    lobbies,
    "ABCD",
    { seconds: 60 }
  );
  await settle();
  assert.equal(result.ok, true);
  assert.equal(result.roundId, 7);
  assert.deepEqual(escaped, []);
  assert.ok(logged.some((l) => l.includes("[!ERROR] score card for P: connect ECONNREFUSED")));
});

test("a pulse check for a lobby that was deleted stops its task", () => {
  const lobbies: any = { WXYZ: { players: [] } };
  schedulePulseCheck(io, lobbies, "WXYZ", 5);
  assert.ok(lobbyTasks.WXYZ);
  delete lobbies.WXYZ; // everyone left
  checkPulse(lobbies, "WXYZ", io);
  assert.equal(lobbyTasks.WXYZ, undefined);
});
