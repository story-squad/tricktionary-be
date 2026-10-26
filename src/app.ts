import express from "express";
import path from "path";
import { createServer } from "http";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
// socket.io
import { Server } from "socket.io";
// redis
import { createAdapter } from "socket.io-redis";
import { RedisClient } from "redis";
// Tricktionary
import { registerGameEvents } from "./sockets/events";
import apiRoutes from "./api";
import { forwardAsyncErrors, handleErrors } from "./api/middleware/asyncErrors";

import { log } from "./logger";
import { errorMessage } from "./errorMessage";

log("[   Tricktionary API   ]");

const api = express();
const JSON_SIZE_LIMIT = "5mb";
const lobbies: any = { DEADBEEF: [] };

api.use(
  bodyParser.json({
    limit: JSON_SIZE_LIMIT,
  })
);

api.use(helmet());
api.use(cors());
api.use(express.json());

api.use("/help", express.static(path.join(__dirname, "docs")));

// CRUD routes
api.get("/", (req, res) =>
  res
    .status(200)
    .json({ api: "running", timestamp: Date.now(), build: "07/22/2022" })
);
api.get("/api", (req, res) =>
  res.status(200).json({ api: "𝜋", timestamp: Date.now() })
);

api.use("/api/words", apiRoutes.word);
api.use("/api/definition-reactions", apiRoutes.definitionReaction);
api.use("/api/reactions", apiRoutes.reaction);
api.use("/api/votes", apiRoutes.vote);
api.use("/api/round", apiRoutes.round);
api.use("/api/user-rounds", apiRoutes.userRound);
api.use("/api/definitions", apiRoutes.definitions);
api.use("/api/admin", apiRoutes.admin);
api.use("/api/auth", apiRoutes.auth);
api.use("/api/player", apiRoutes.player);
api.use("/api/bot", apiRoutes.bots);
api.use("/api/game", apiRoutes.game);
api.use("/api/choice", apiRoutes.choice);
api.use("/api/payments", apiRoutes.payment);
api.use("/api/member", apiRoutes.member);
api.use("/api/smash", apiRoutes.smash);
api.use("/api/score", apiRoutes.score);
// an error in any API route becomes a 500 reply, not a crash
Object.values(apiRoutes).forEach(forwardAsyncErrors);
api.use(handleErrors);
// web sockets
const socketApp = createServer(api);
const io = new Server(socketApp, { cors: { origin: "*" } });

const redisHost: string = process.env.REDIS_HOST || "";
const redisPort: string = process.env.REDIS_PORT || "6379";

// use Redis (cache) when available
if (redisHost.length > 0) {
  // create Redis adapter
  log("found REDIS_HOST, creating adapter.");
  try {
    const pubClient = new RedisClient({
      host: redisHost,
      port: Number(redisPort),
    });
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter({ pubClient, subClient }));
    // The adapter listens for its clients' errors and emits them itself; an
    // EventEmitter with no "error" listener throws, which stops the process.
    io.of("/").adapter.on("error", (err: unknown) =>
      log(`[adapter] redis error: ${errorMessage(err)}`)
    );
  } catch (err) {
    log("[error connecting Redis adapter!]");
    if (err instanceof Error) {
      log(err.message);
    }
  }
}

// events
io.on("connect_error", (err: Error) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on("connection", (socket) => registerGameEvents(io, socket, lobbies));

export { socketApp };
