// Run with `npm test` (Node's built-in runner on the compiled output).
//
// A fresh player joining through the invite flow, and one correct vote, run
// through the real socket handlers with the boundaries faked: socket.io (a
// small in-memory hub), and localAxios (the handlers' calls to this server's
// REST API, which is where the database sits). No server or database needed.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { localAxios } from "../common";
import handleLobbyCreate from "../handleLobbyCreate";
import handleLobbyJoin from "../handleLobbyJoin";
import { handleArrayOfGuesses } from "../handleGuess";

type Call = { method: string; url: string; body?: any };
let calls: Call[] = [];
let playerCount = 0;
// player records by last_user_id (the socket id), as /api/auth keeps them
let playersBySocket = new Map<string, string>();

// localAxios: answer the REST calls the handlers make, and record them
function fakeApi() {
  const reply = (data: any, status = 200) => Promise.resolve({ data, status });
  const api = localAxios as any;
  api.get = (url: string) => {
    calls.push({ method: "get", url });
    if (url.startsWith("/api/player/last-user-id/")) {
      return reply({ player: { id: "host-pid" } });
    }
    // a fresh player's socket has no player record until new-player makes one
    if (url.startsWith("/api/auth/find-player/")) {
      const pid = playersBySocket.get(url.split("/").pop() as string);
      return reply(pid ? { id: pid } : {});
    }
    return reply({});
  };
  api.post = (url: string, body?: any) => {
    calls.push({ method: "post", url, body });
    switch (url) {
      case "/api/game/new":
        return reply({ ok: true, game_id: "game-1" });
      case "/api/auth/new-player":
        playerCount++;
        playersBySocket.set(body.last_user_id, `pid-${playerCount}`);
        return reply({ token: `new-token-${playerCount}`, pid: `pid-${playerCount}` });
      case "/api/auth/update-token":
        return reply({ ok: true, token: `token-for-${body.p_id}` });
      case "/api/round/finish":
        return reply({ ok: true });
      default:
        return reply({ ok: true }, 201);
    }
  };
  api.put = (url: string, body?: any) => {
    calls.push({ method: "put", url, body });
    return reply({ ok: true });
  };
}

// socket.io: rooms and emits, in memory
type FakeSocket = {
  id: string;
  rooms: Set<string>;
  received: [string, any[]][];
  join: (room: string) => void;
  leave: (room: string) => void;
  onEvent?: (event: string, args: any[]) => void;
};
let sockets: FakeSocket[] = [];
const io = {
  to: (room: string) => ({
    emit: (event: string, ...args: any[]) => {
      sockets
        .filter((s) => s.rooms.has(room))
        .forEach((s) => {
          s.received.push([event, args]);
          s.onEvent?.(event, args);
        });
    },
  }),
};
function connect(id: string): FakeSocket {
  const socket: FakeSocket = {
    id,
    rooms: new Set([id]),
    received: [],
    join: (room) => socket.rooms.add(room),
    leave: (room) => socket.rooms.delete(room),
  };
  sockets.push(socket);
  return socket;
}

/**
 * The invite flow as the FE runs it: the player clicks Join once, and the FE
 * answers each "token update" received meanwhile with another "join lobby" on
 * the same socket. Resolves when every join has finished.
 */
async function joinFromInvite(
  socket: FakeSocket,
  username: string,
  lobbyCode: string,
  lobbies: any
) {
  const joins: Promise<unknown>[] = [];
  const join = () =>
    joins.push(
      handleLobbyJoin(io, socket, username, lobbyCode, lobbies, false, false)
    );
  socket.onEvent = (event) => {
    if (event === "token update" && joins.length < 5) join();
  };
  join();
  // wait until no join is still running (retries are added while they run)
  let awaited = 0;
  while (awaited < joins.length) {
    awaited = joins.length;
    await Promise.all(joins);
  }
  socket.onEvent = undefined;
  return joins.length;
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

async function lobbyWithFreshPlayer() {
  const lobbies: any = {};
  const host = connect("host-socket");
  await handleLobbyCreate(io, host, "Host", lobbies);
  const [lobbyCode] = Object.keys(lobbies);
  const player = connect("player-socket");
  const joins = await joinFromInvite(player, "Fresh", lobbyCode, lobbies);
  return { lobbies, lobbyCode, host, player, joins };
}

beforeEach(() => {
  calls = [];
  sockets = [];
  playerCount = 0;
  playersBySocket = new Map();
  fakeApi();
});

test("a fresh player joining from an invite is listed once", async () => {
  const { lobbies, lobbyCode, player, joins } = await lobbyWithFreshPlayer();
  const lobby = lobbies[lobbyCode];

  // the FE did retry the join, so the case under test happened
  assert.ok(joins > 1, `expected the FE to retry the join, got ${joins} join(s)`);
  assert.deepEqual(
    lobby.players.map((p: any) => p.id),
    ["host-socket", "player-socket"]
  );
  assert.deepEqual(
    lobby.rounds[0].scores.map((s: any) => s.playerId),
    ["host-socket", "player-socket"]
  );
  // one player record created for the socket
  assert.equal(
    calls.filter((c) => c.url === "/api/auth/new-player").length,
    1
  );
  assert.ok(player.rooms.has(lobbyCode));
});

test("one correct vote awards one point", async () => {
  const { lobbies, lobbyCode, host } = await lobbyWithFreshPlayer();
  lobbies[lobbyCode].roundId = 7;
  lobbies[lobbyCode].phase = "GUESSING";
  calls = [];

  // the fresh player picks the real definition (guess 0)
  await handleArrayOfGuesses(io, host, lobbyCode, lobbies, [
    { player: "player-socket", guess: 0 },
  ]);
  await flush();

  const lobby = lobbies[lobbyCode];
  const fresh = lobby.players.filter((p: any) => p.id === "player-socket");
  assert.equal(fresh.length, 1);
  assert.equal(fresh[0].points, 1);
  const roundScore = lobby.rounds[0].scores.find(
    (s: any) => s.playerId === "player-socket"
  );
  assert.equal(roundScore.score, 1);

  // exactly one score increase reaches the API (and so the database): one
  // point, for the fresh player, in this game
  const increases = calls.filter((c) => c.url.startsWith("/api/score/increase/"));
  assert.deepEqual(increases, [
    {
      method: "put",
      url: `/api/score/increase/${fresh[0].pid}`,
      body: { game_id: "game-1", points: 1 },
    },
  ]);
  assert.equal(lobby.phase, "POSTGAME");
});
