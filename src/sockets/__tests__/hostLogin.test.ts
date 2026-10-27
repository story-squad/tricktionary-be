// Run with `npm test` (Node's built-in runner on the compiled output).
//
// A fresh host clicks Host New Game: the front end sends "login" and then,
// without waiting for its reply, "create lobby". Both go through the real
// event listeners (registerGameEvents). socket.io is a small in-memory hub;
// localAxios answers the handlers' REST calls from an in-memory Player table,
// as the real routes do, with player creation answering late, as a database
// insert can. The host
// then refreshes and logs in again with the token it was given.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";
import { localAxios } from "../common";
import { registerGameEvents } from "../events";
import { lobbyTasks } from "../crontab";

type PlayerRow = { id: string; last_user_id: string; name?: string; last_played?: string };
let players: Map<string, PlayerRow>;
let newPlayerFails = false;

const api = localAxios as any;
const original = { get: api.get, post: api.post, put: api.put };
const consoleLog = console.log;
const later = <T>(value: T, ms = 30) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
const reply = (data: any, status = 200) => Promise.resolve({ data, status });
// what Postgres says to a Player.id that is not a uuid
const uuidError = (id: string) => `invalid input syntax for type uuid: "${id}"`;
const bySocket = (sid: string) =>
  [...players.values()].find((p) => p.last_user_id === sid);
// the fake token is its payload as JSON, so a test can read p_id from it
const tokenPayload = (token: string) => JSON.parse(token);

function fakeApi() {
  api.get = (url: string) => {
    const sid = url.split("/").pop() as string;
    if (url.startsWith("/api/player/last-user-id/")) {
      return reply({ ok: true, player: bySocket(sid) });
    }
    if (url.startsWith("/api/auth/find-player/")) {
      return reply(bySocket(sid) ? { id: bySocket(sid)!.id } : {});
    }
    return reply({});
  };
  api.post = (url: string, body: any) => {
    switch (url) {
      case "/api/auth/new-player": {
        if (newPlayerFails) return Promise.reject(new Error("database is down"));
        const row = { id: randomUUID(), last_user_id: body.last_user_id };
        // the record exists only once the insert has finished
        return later(null).then(() => {
          players.set(row.id, row);
          return { data: { token: JSON.stringify({ p_id: row.id }), pid: row.id }, status: 200 };
        });
      }
      case "/api/auth/login": {
        const { p_id } = tokenPayload(body.last_token);
        const row = players.get(p_id);
        // the route replies 200 with no token when the lookup throws
        if (!row) return reply({ message: uuidError(p_id) });
        const old_user_id = row.last_user_id;
        row.last_user_id = body.user_id;
        return reply({
          token: JSON.stringify({ p_id }),
          player: { id: row.id, name: row.name, last_played: row.last_played },
          old_user_id,
          old_user_name: row.name,
        });
      }
      case "/api/auth/update-token":
        return reply({ ok: true, token: JSON.stringify({ p_id: body.p_id }) });
      case "/api/game/new":
        // Game.og_host is a string column; any value is stored
        return reply({ ok: true, game_id: 1 });
      default:
        return reply({ ok: true });
    }
  };
  api.put = (url: string, body: any) => {
    const pid = url.split("/").pop() as string;
    if (url.startsWith("/api/player/id/")) {
      const row = players.get(pid);
      // updatePlayer catches the database error; the route still replies 200
      if (!row) return reply({ player: { ok: false, message: uuidError(pid) } });
      Object.assign(row, { last_played: body.last_played ?? row.last_played });
    }
    return reply({ ok: true });
  };
}

// socket.io: rooms and emits, in memory
let sockets: any[] = [];
const io = {
  to: (room: string) => ({
    emit: (event: string, ...args: any[]) =>
      sockets
        .filter((s) => s.rooms.has(room))
        .forEach((s) => s.received.push([event, args])),
  }),
};
function connect(id: string, lobbies: any) {
  const socket: any = new EventEmitter();
  socket.id = id;
  socket.rooms = new Set([id]);
  socket.received = [];
  socket.join = (room: string) => socket.rooms.add(room);
  socket.leave = (room: string) => socket.rooms.delete(room);
  sockets.push(socket);
  registerGameEvents(io, socket, lobbies);
  return socket;
}
const tokens = (socket: any): string[] =>
  socket.received.filter(([e]: any) => e === "token update").map(([, a]: any) => a[0]);
const errors = (socket: any) =>
  socket.received.filter(([e]: any) => e === "error").map(([, a]: any) => a);
const settle = () => new Promise((resolve) => setTimeout(resolve, 150));

beforeEach(() => {
  players = new Map();
  newPlayerFails = false;
  sockets = [];
  fakeApi();
  console.log = () => {};
});
afterEach(() => {
  console.log = consoleLog;
  Object.assign(api, original);
  for (const code of Object.keys(lobbyTasks)) {
    lobbyTasks[code].task.stop(); // the pulse check a re-join schedules
    delete lobbyTasks[code];
  }
});

test("fresh host: login then create lobby at once; host is a Player and keeps host on refresh", async () => {
  const lobbies: any = {};
  const host = connect("host-socket", lobbies);
  host.emit("login");
  host.emit("create lobby", "Hosty");
  await settle();

  const [lobbyCode] = Object.keys(lobbies);
  assert.ok(lobbyCode, "lobby was created");
  const hostEntry = lobbies[lobbyCode].players[0];
  assert.ok(players.has(hostEntry.pid), `host pid ${hostEntry.pid} is a Player.id`);
  assert.equal(players.size, 1, "one player record for the host");
  const hostToken = tokens(host).pop() as string;
  assert.equal(tokenPayload(hostToken).p_id, hostEntry.pid);

  const guest = connect("guest-socket", lobbies);
  guest.emit("login");
  guest.emit("join lobby", "Guesty", lobbyCode);
  await settle();
  assert.deepEqual(errors(guest), []);
  assert.equal(lobbies[lobbyCode].players.length, 2);

  // the host refreshes: a new socket logs in with the saved token
  const back = connect("host-socket-2", lobbies);
  back.emit("login", hostToken, "Hosty");
  await settle();

  assert.deepEqual(errors(back), []);
  assert.equal(lobbies[lobbyCode].host, "host-socket-2", "host controls restored");
  assert.ok(back.rooms.has(lobbyCode));
  const pids = lobbies[lobbyCode].players.map((p: any) => p.pid);
  assert.equal(pids.filter((p: string) => p === hostEntry.pid).length, 1);
  assert.ok(lobbies[lobbyCode].players.some((p: any) => p.id === "guest-socket"));
});

test("create lobby with no login: a player record is made for the host", async () => {
  const lobbies: any = {};
  const host = connect("host-socket", lobbies);
  host.emit("create lobby", "Hosty");
  await settle();

  const [lobbyCode] = Object.keys(lobbies);
  assert.ok(lobbyCode, "lobby was created");
  assert.ok(players.has(lobbies[lobbyCode].players[0].pid));
});

test("no player record can be made: no lobby, and the host is told", async () => {
  newPlayerFails = true;
  const lobbies: any = {};
  const host = connect("host-socket", lobbies);
  host.emit("login");
  host.emit("create lobby", "Hosty");
  await settle();

  assert.deepEqual(Object.keys(lobbies), []);
  assert.deepEqual(errors(host), [
    [2003, "The lobby could not be created. Please try again."],
  ]);
  assert.deepEqual([...host.rooms], ["host-socket"]);
});
