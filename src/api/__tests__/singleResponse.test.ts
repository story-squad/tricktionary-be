// Run with `npm test` (Node's built-in runner on the compiled output).
//
// Each API route answers a request exactly once, on its error paths too. A
// second res.json throws ERR_HTTP_HEADERS_SENT, which used to stop the server.
// The routers are mounted bare (without the error-forwarding safety net in
// app.ts), with the database boundary (the models) faked; no database needed.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import express, { Router } from "express";
import Player from "../player/model";
import userRounds from "../userRounds/model";
import * as scoreModel from "../score/model";
import Game from "../game/model";
import Member from "../member/model";
import Rounds from "../rounds/model";
import Super from "../admin/model";
import choiceModel from "../hostChoices/model";
import Words from "../words/model";
import * as paymentModel from "../payment/model";
import Definitions from "../definitions/model";
import DefinitionReactions from "../definitionReactions/model";
import { stripe } from "../payment/StripePayments";
import apiRoutes from "..";
// supertest ships without types; it is only called here
const request: any = require("supertest");

// every res.json call, and every error that escaped a handler
let sends = 0;
let escaped: unknown[] = [];
process.on("unhandledRejection", (err) => escaped.push(err));

// fake a model function for one test; afterEach puts the original back
let restore: (() => void)[] = [];
function fake(obj: any, name: string, fn: (...args: any[]) => any) {
  const original = obj[name];
  obj[name] = fn;
  restore.push(() => (obj[name] = original));
}
const dbError = () =>
  Promise.reject(new Error('invalid input syntax for type uuid: "not-a-uuid"'));
const resolves = (value: any) => () => Promise.resolve(value);

function appFor(path: string, router: Router) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    const json = res.json.bind(res);
    res.json = (body?: any) => {
      sends++;
      return json(body);
    };
    next();
  });
  app.use(path, router);
  return app;
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

beforeEach(() => {
  sends = 0;
  escaped = [];
  restore = [];
});
afterEach(() => restore.reverse().forEach((undo) => undo()));

type Case = {
  name: string;
  mount: [string, Router];
  fakes?: () => void;
  send: (agent: any) => any;
  status: number;
};

const cases: Case[] = [
  {
    name: "GET /api/player/id/:id, database error",
    mount: ["/api/player", apiRoutes.player],
    fakes: () => fake(Player, "getPlayer", dbError),
    send: (r) => r.get("/api/player/id/not-a-uuid"),
    status: 400,
  },
  {
    name: "GET /api/player/name/:id, database error",
    mount: ["/api/player", apiRoutes.player],
    fakes: () => fake(Player, "getName", dbError),
    send: (r) => r.get("/api/player/name/not-a-uuid"),
    status: 400,
  },
  {
    name: "PUT /api/player/id/:id, database error",
    mount: ["/api/player", apiRoutes.player],
    fakes: () => fake(Player, "updatePlayer", dbError),
    send: (r) => r.put("/api/player/id/not-a-uuid").send({ name: "x" }),
    status: 400,
  },
  {
    name: "GET /api/user-rounds/user/:uid/game/:gid, database error",
    mount: ["/api/user-rounds", apiRoutes.userRound],
    fakes: () => fake(userRounds, "findAll", dbError),
    send: (r) => r.get("/api/user-rounds/user/not-a-uuid/game/not-a-uuid"),
    status: 400,
  },
  {
    name: "GET /api/user-rounds/user/:id, database error",
    mount: ["/api/user-rounds", apiRoutes.userRound],
    fakes: () => fake(userRounds, "findPlayer", dbError),
    send: (r) => r.get("/api/user-rounds/user/not-a-uuid"),
    status: 200,
  },
  {
    name: "GET /api/user-rounds/user/:id/last, database error",
    mount: ["/api/user-rounds", apiRoutes.userRound],
    fakes: () => fake(userRounds, "findLastRound", dbError),
    send: (r) => r.get("/api/user-rounds/user/not-a-uuid/last"),
    status: 200,
  },
  {
    name: "GET /api/user-rounds/user/:id/first, database error",
    mount: ["/api/user-rounds", apiRoutes.userRound],
    fakes: () => fake(userRounds, "findFirstRound", dbError),
    send: (r) => r.get("/api/user-rounds/user/not-a-uuid/first"),
    status: 200,
  },
  {
    name: "POST /api/user-rounds/add-players, missing fields",
    mount: ["/api/user-rounds", apiRoutes.userRound],
    fakes: () =>
      fake(userRounds, "addAllUserRounds", resolves({ ok: false, message: "no" })),
    send: (r) => r.post("/api/user-rounds/add-players").send({}),
    status: 400,
  },
  {
    name: "PUT /api/score/def/:player_id, update fails",
    mount: ["/api/score", apiRoutes.score],
    fakes: () =>
      fake(scoreModel, "updateDefinition", resolves({ ok: false, error: "bad uuid" })),
    send: (r) =>
      r
        .put("/api/score/def/not-a-uuid")
        .send({ game_id: "not-a-uuid", top_definition_id: 1 }),
    status: 400,
  },
  {
    name: "POST /api/score/latest/:game_id, no score cards",
    mount: ["/api/score", apiRoutes.score],
    fakes: () => fake(scoreModel, "getLatest", resolves({ ok: true, latest: [] })),
    send: (r) => r.post("/api/score/latest/game-1"),
    status: 200,
  },
  {
    name: "POST /api/score/latest/:game_id, database error in the loop",
    mount: ["/api/score", apiRoutes.score],
    fakes: () => {
      fake(
        scoreModel,
        "getLatest",
        resolves({
          ok: true,
          latest: [
            { player_id: "p1", points: 1, top_definition_id: 1 },
            { player_id: "p2", points: 0, top_definition_id: 2 },
          ],
        })
      );
      fake(scoreModel, "findTopDefinition", dbError);
    },
    send: (r) => r.post("/api/score/latest/game-1"),
    status: 200,
  },
  {
    name: "POST /api/game/new, database error",
    mount: ["/api/game", apiRoutes.game],
    fakes: () => fake(Game, "add", dbError),
    send: (r) => r.post("/api/game/new").send({ og_host: "host" }),
    status: 400,
  },
  {
    name: "POST /api/member/new, database error",
    mount: ["/api/member", apiRoutes.member],
    fakes: () => fake(Member, "add", dbError),
    send: (r) => r.post("/api/member/new").send({ email: "a@example.com" }),
    status: 400,
  },
  {
    name: "GET /api/round/id/:id, invalid id",
    mount: ["/api/round", apiRoutes.round],
    fakes: () => fake(Rounds, "get", resolves({})),
    send: (r) => r.get("/api/round/id/abc"),
    status: 400,
  },
  {
    name: "GET /api/round/id/:id, database error",
    mount: ["/api/round", apiRoutes.round],
    fakes: () => fake(Rounds, "get", dbError),
    send: (r) => r.get("/api/round/id/1"),
    status: 400,
  },
  {
    name: "POST /api/auth/login, missing fields",
    mount: ["/api/auth", apiRoutes.auth],
    send: (r) => r.post("/api/auth/login").send({}),
    status: 403,
  },
  {
    name: "GET /api/admin/word/:word_id, invalid id",
    mount: ["/api/admin", apiRoutes.admin],
    fakes: () => fake(Super, "getWordDetails", resolves({})),
    send: (r) => r.get("/api/admin/word/0"),
    status: 400,
  },
  {
    name: "GET /api/admin/definition/:id, invalid id",
    mount: ["/api/admin", apiRoutes.admin],
    fakes: () => fake(Super, "getDefinitionDetails", resolves({})),
    send: (r) => r.get("/api/admin/definition/0"),
    status: 400,
  },
  {
    name: "GET /api/choice/id/:id, invalid id",
    mount: ["/api/choice", apiRoutes.choice],
    fakes: () => fake(choiceModel, "getHostChoiceById", resolves({})),
    send: (r) => r.get("/api/choice/id/0"),
    status: 400,
  },
  {
    name: "GET /api/words/id/:id, invalid id",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => fake(Words, "getById", resolves({})),
    send: (r) => r.get("/api/words/id/0"),
    status: 400,
  },
  {
    name: "PUT /api/words/id/:id/approve, invalid id",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => {
      fake(Words, "getById", resolves({}));
      fake(Words, "update", resolves({}));
    },
    send: (r) => r.put("/api/words/id/0/approve"),
    status: 400,
  },
  {
    name: "PUT /api/words/id/:id/reject, invalid id",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => {
      fake(Words, "getById", resolves({}));
      fake(Words, "update", resolves({}));
    },
    send: (r) => r.put("/api/words/id/0/reject"),
    status: 400,
  },
  {
    name: "PUT /api/words/id/:id, invalid id",
    mount: ["/api/words", apiRoutes.word],
    send: (r) => r.put("/api/words/id/0").send({}),
    status: 400,
  },
  {
    name: "POST /api/payments/checkout, unknown item",
    mount: ["/api/payments", apiRoutes.payment],
    fakes: () => {
      fake(paymentModel, "add", resolves({ ok: false, message: "no member" }));
      fake(stripe.paymentIntents, "create", () =>
        Promise.reject(new Error("no network in tests"))
      );
    },
    send: (r) =>
      r
        .post("/api/payments/checkout")
        .send({ cart: { items: ["lifetime"] }, member_id: "m" }),
    status: 400,
  },
  {
    name: "GET /api/admin/round/:id, invalid id",
    mount: ["/api/admin", apiRoutes.admin],
    fakes: () => fake(Super, "getRound", resolves({})),
    send: (r) => r.get("/api/admin/round/abc"),
    status: 400,
  },
  {
    name: "GET /api/definitions/round/:round_id",
    mount: ["/api/definitions", apiRoutes.definitions],
    fakes: () => fake(Definitions, "thisRound", resolves([])),
    send: (r) => r.get("/api/definitions/round/1"),
    status: 200,
  },
  {
    name: "GET /api/definitions/round/:round_id, database error",
    mount: ["/api/definitions", apiRoutes.definitions],
    fakes: () => fake(Definitions, "thisRound", dbError),
    send: (r) => r.get("/api/definitions/round/abc"),
    status: 400,
  },
  ...[
    ["/user/x", "getByUser"],
    ["/round/1", "getByRound"],
    ["/reaction/1", "getByReaction"],
    ["/definition/1", "getByDefinition"],
    ["/finished", "getFinished"],
    ["/unfinished", "getUnfinished"],
  ].flatMap(([path, lookup]): Case[] => [
    {
      name: `GET /api/definition-reactions${path}`,
      mount: ["/api/definition-reactions", apiRoutes.definitionReaction],
      fakes: () => fake(DefinitionReactions, lookup, resolves([])),
      send: (r) => r.get(`/api/definition-reactions${path}`),
      status: 200,
    },
    {
      name: `GET /api/definition-reactions${path}, database error`,
      mount: ["/api/definition-reactions", apiRoutes.definitionReaction],
      fakes: () => fake(DefinitionReactions, lookup, dbError),
      send: (r) => r.get(`/api/definition-reactions${path}`),
      status: 400,
    },
  ]),
  {
    name: "GET /api/words/by-name/:word, database error",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => fake(Words, "getByName", dbError),
    send: (r) => r.get("/api/words/by-name/x"),
    status: 500,
  },
  {
    name: "POST /api/words/contribute, lookup error",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => fake(Words, "getByName", dbError),
    send: (r) => r.post("/api/words/contribute").send({ word: "w", definition: "d" }),
    status: 400,
  },
  {
    name: "POST /api/words/contribute, insert error",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => {
      fake(Words, "getByName", resolves(undefined));
      fake(Words, "add", dbError);
    },
    send: (r) => r.post("/api/words/contribute").send({ word: "w", definition: "d" }),
    status: 400,
  },
  {
    name: "POST /api/words/contribute, new word",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => {
      fake(Words, "getByName", resolves(undefined));
      fake(Words, "add", resolves([7]));
    },
    send: (r) => r.post("/api/words/contribute").send({ word: "w", definition: "d" }),
    status: 201,
  },
  {
    name: "POST /api/words/contribute, existing word",
    mount: ["/api/words", apiRoutes.word],
    fakes: () => fake(Words, "getByName", resolves({ id: 3, word: "w" })),
    send: (r) => r.post("/api/words/contribute").send({ word: "w", definition: "d" }),
    status: 200,
  },
  ...["approve", "reject"].flatMap((verb): Case[] => [
    {
      name: `PUT /api/words/id/:id/${verb}, lookup error`,
      mount: ["/api/words", apiRoutes.word],
      fakes: () => {
        fake(Words, "getById", dbError);
        fake(Words, "update", resolves({}));
      },
      send: (r) => r.put(`/api/words/id/1/${verb}`),
      status: 500,
    },
    {
      name: `PUT /api/words/id/:id/${verb}, update error`,
      mount: ["/api/words", apiRoutes.word],
      fakes: () => {
        fake(Words, "getById", resolves({ id: 1, word: "w" }));
        fake(Words, "update", dbError);
      },
      send: (r) => r.put(`/api/words/id/1/${verb}`),
      status: 500,
    },
  ]),
];

for (const c of cases) {
  test(`${c.name}: one response, nothing thrown`, async () => {
    c.fakes?.();
    const app = appFor(...c.mount);
    const res = await c.send(request(app)).timeout(2000);
    await flush();
    assert.equal(res.status, c.status);
    assert.equal(sends, 1, `expected one res.json call, got ${sends}`);
    assert.deepEqual(escaped, []);
  });
}

// GET /api/score/player/:id and /api/score/games/:id used to reply before the
// lookup finished, so the body was {} (a promise serialized), on a failed
// lookup too. They now reply once with the rows, or 400 with the error.
const scoreRows = [
  { id: "s-1", player_id: "p-1", game_id: "g-1", points: 2, top_definition_id: null },
];
for (const [path, lookup] of [
  ["/api/score/player/p-1", "getGames"],
  ["/api/score/games/g-1", "getPlayers"],
]) {
  test(`GET ${path}: replies once with the rows`, async () => {
    fake(scoreModel, lookup, resolves(scoreRows));
    const res = await request(appFor("/api/score", apiRoutes.score)).get(path).timeout(2000);
    await flush();
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, scoreRows);
    assert.equal(sends, 1);
    assert.deepEqual(escaped, []);
  });
  test(`GET ${path}: a failed lookup replies once with 400`, async () => {
    fake(scoreModel, lookup, resolves({ ok: false, message: "database is down" }));
    const res = await request(appFor("/api/score", apiRoutes.score)).get(path).timeout(2000);
    await flush();
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "database is down" });
    assert.equal(sends, 1);
    assert.deepEqual(escaped, []);
  });
  test(`GET ${path}: a rejected lookup replies once with 400`, async () => {
    fake(scoreModel, lookup, dbError);
    const res = await request(appFor("/api/score", apiRoutes.score)).get(path).timeout(2000);
    await flush();
    assert.equal(res.status, 400);
    assert.match(res.body.error, /invalid input syntax/);
    assert.equal(sends, 1);
    assert.deepEqual(escaped, []);
  });
}
