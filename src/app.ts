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
import gameSocketHandler from "./sockets";
import apiRoutes from "./api";

import { log } from "./logger";

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
api.get("/", (req: any, res: any) =>
  res
    .status(200)
    .json({ api: "running", timestamp: Date.now(), build: "Feb 02/16/2022" })
);
api.get("/api", (req: any, res: any) =>
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
  } catch (err:any){
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

io.on("connection", (socket) => {
  // LOGIN
  socket.on("login", async (token: string | undefined) => {
    if (token && token.length > 0) {
      gameSocketHandler.handleReturningPlayer(io, socket, token, lobbies);
      log(`Handling returning player - token: ${token}`);
    } else {
      gameSocketHandler.handleNewPlayer(io, socket);
      log(`Handling new player`);
    }
  });
  // more events to come.
  socket.on("disconnecting", () => {
    gameSocketHandler.handleDisconnection(io, socket, lobbies);
  });

  socket.on("update username", (newUsername: string) => {
    gameSocketHandler.handleUpdateUsername(io, socket, lobbies, newUsername);
  });
  socket.on("synchronize", (seconds: number) => {
    gameSocketHandler.handleTimeSync(io, socket, lobbies, seconds);
  });
  socket.on("disconnect", () => {
    log(`Client disconnected, ${socket.id}`);
  });

  socket.on("create lobby", (username: string) => {
    gameSocketHandler.handleLobbyCreate(io, socket, username, lobbies);
  });

  socket.on("join lobby", (username: string, lobbyCode: string) => {
    gameSocketHandler.handleLobbyJoin(
      io,
      socket,
      username,
      lobbyCode,
      lobbies,
      false,
      false
    );
  });

  socket.on(
    "manage alphabot",
    (botName: string, botID: string, action: string, lobbyCode: string) => {
      gameSocketHandler.handleAlphaBot(
        io,
        socket,
        botName,
        botID,
        action,
        lobbyCode,
        lobbies
      );
    }
  );

  socket.on(
    "start game",
    (settings: any, lobbyCode: string, hostChoice: any) => {
      gameSocketHandler.handleStartGame(
        io,
        socket,
        lobbyCode,
        lobbies,
        settings,
        hostChoice
      );
    }
  );

  socket.on("definition submitted", (definition: string, lobbyCode: string) => {
    gameSocketHandler.handleSubmitDefinition(
      io,
      socket,
      definition,
      lobbyCode,
      lobbies
    );
  });

  socket.on(
    "bot definition submitted",
    (definition: string, botID: string, lobbyCode: string) => {
      gameSocketHandler.handleAlphaBotSubmission(
        io,
        socket,
        definition,
        botID,
        lobbyCode,
        lobbies
      );
    }
  );

  socket.on("guess", (lobbyCode: string, guesses: any[]) => {
    gameSocketHandler.handleArrayOfGuesses(
      io,
      socket,
      lobbyCode,
      lobbies,
      guesses
    );
  });

  socket.on("msg host", (message: string) => {
    gameSocketHandler.handleMessageHost(
      io,
      socket,
      lobbies,
      "msg host",
      message
    );
  });

  socket.on("player guess", (playerId: string, definitionKey: number) => {
    gameSocketHandler.handleMessagePlayer(
      io,
      socket,
      lobbies,
      playerId,
      "player guess",
      definitionKey
    );
  });
  socket.on("play again", (settings: any, lobbyCode: string) => {
    gameSocketHandler.handlePlayAgain(io, socket, lobbyCode, lobbies, settings);
  });

  socket.on("set phase", (phase: string, lobbyCode: string) => {
    gameSocketHandler.handleSetPhase(io, socket, lobbyCode, lobbies, phase);
  });

  socket.on(
    "set host",
    (newHost: string, lobbyCode: string, guesses: any[]) => {
      gameSocketHandler.handleSetNewHost(
        io,
        socket,
        lobbyCode,
        lobbies,
        newHost,
        guesses
      );
    }
  );
  socket.on("reveal results", (lobbyCode: string, guesses: any[]) => {
    gameSocketHandler.handleRevealResults(
      io,
      socket,
      lobbyCode,
      lobbies,
      guesses
    );
  });

  socket.on("set finale", (lobbyCode: string) => {
    gameSocketHandler.handleSetFinale(io, socket, lobbyCode, lobbies);
  });

  socket.on("send reaction", (definitionID: number, reactionID: number) => {
    gameSocketHandler.handleEmojiSmash(
      io,
      socket,
      lobbies,
      definitionID,
      reactionID
    );
  });
  socket.on("get reactions", () => {
    gameSocketHandler.handleGetReactions(io, socket, lobbies);
  });
  socket.on("disconnect me", () => {
    gameSocketHandler.removeFromLobby(io, socket, lobbies);
  });
  socket.on("remote paint", (vector: number[]) => {
    // start with a simple array of numbers
    log(`[PAINT] ${vector.map((n) => String(n))}`);
    gameSocketHandler.handleRemotePaint(io, socket, lobbies, vector);
  });
});

export { socketApp };
