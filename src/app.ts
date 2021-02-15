import express from "express";
import { createServer } from "http";
import * as socketIO from "socket.io";
import gameSocketHandler from "./sockets";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import wordRoutes from "./api/words/routes";
import reactionRoutes from "./api/reactions/routes";
import definitionReactionRoutes from "./api/definitionReactions/routes";
import voteRoutes from "./api/votes/routes";
import roundRoutes from "./api/rounds/routes";
import userRoundRoutes from "./api/userRounds/routes";
import definitionsRoutes from "./api/definitions/routes";
import adminRoutes from "./api/admin/routes";
import authRoutes from "./api/auth/routes";
import playerRoutes from "./api/player/routes";
import gameRoutes from "./api/game/routes";
import playedRoutes from "./api/played/routes";
import choiceRoutes from "./api/hostChoices/routes"

// testing
import cleverRoutes from "./api/clever/routes";
import { log } from "./logger";
log("Tricktionary");
const api = express();
const JSON_SIZE_LIMIT = "5mb";
const lobbies: any = { DEADBEEF: [] };

api.use(
  bodyParser.json({
    limit: JSON_SIZE_LIMIT
  })
);

api.use(helmet());
api.use(cors());
api.use(express.json());

// CRUD routes
api.get("/", (req, res) =>
  res.status(200).json({ api: "running", timestamp: Date.now() })
);
api.get("/api", (req, res) =>
  res.status(200).json({ api: "𝜋", timestamp: Date.now() })
);

api.use("/api/words", wordRoutes);
api.use("/api/definition-reactions", definitionReactionRoutes);
api.use("/api/reactions", reactionRoutes);
api.use("/api/votes", voteRoutes);
api.use("/api/round", roundRoutes);
api.use("/api/user-rounds", userRoundRoutes);
api.use("/api/definitions", definitionsRoutes);
api.use("/api/admin", adminRoutes);
api.use("/api/auth", authRoutes);
api.use("/api/player", playerRoutes);
api.use("/api/game", gameRoutes);
api.use("/api/played", playedRoutes);
api.use("/api/choice", choiceRoutes)
// testing
api.use("/api/clever", cleverRoutes);

// web sockets
const socketApp = createServer(api);
const io = new socketIO.Server(socketApp, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // LOGIN
  socket.on("login", (token: string | undefined) => {
    if (token && token.length > 0) {
      gameSocketHandler.handleReturningPlayer(io, socket, token, lobbies);
    } else {
    gameSocketHandler.handleNewPlayer(io, socket);
    }
  });
  // more events to come.
  socket.on("disconnecting", () => {
    console.log("Client disconnecting...");
    // handler will broadcast ("remove player", player.id) to the lobby.
    gameSocketHandler.handleDisconnection(io, socket, lobbies);
  });

  socket.on("update username", (newUsername: string) => {
    gameSocketHandler.handleUpdateUsername(io, socket, lobbies, newUsername);
  });
  socket.on("synchronize", (seconds: number) => {
    gameSocketHandler.handleTimeSync(io, socket, lobbies, seconds);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });

  socket.on("create lobby", (username: string) => {
    gameSocketHandler.handleLobbyCreate(io, socket, username, lobbies);
  });

  socket.on("join lobby", (username: string, lobbyCode: string) => {
    gameSocketHandler.handleLobbyJoin(io, socket, username, lobbyCode, lobbies);
  });

  socket.on(
    "rejoin lobby",
    (username: string, password: string, lobbyCode: string) => {
      gameSocketHandler.handleLobbyJoinWithPassword(
        io,
        socket,
        username,
        password,
        lobbyCode,
        lobbies
      );
    }
  );

  socket.on("start game", (settings: any, lobbyCode: string, hostChoice: any) => {
    gameSocketHandler.handleStartGame(io, socket, lobbyCode, lobbies, settings, hostChoice);
  });

  socket.on("definition submitted", (definition: string, lobbyCode: string) => {
    gameSocketHandler.handleSubmitDefinition(
      io,
      socket,
      definition,
      lobbyCode,
      lobbies
    );
  });

  socket.on("guess", (lobbyCode: string, guesses: any[]) => {
    gameSocketHandler.handleArrayOfGuesses(
      io,
      socket,
      lobbyCode,
      lobbies,
      guesses
    );
    // gameSocketHandler.handleGuess(
    //   io,
    //   socket,
    //   lobbyCode,
    //   guess,
    //   reactions,
    //   lobbies
    // );
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
  socket.on("set host", (newHost: string, lobbyCode: string) => {
    gameSocketHandler.handleSetNewHost(io, socket, lobbyCode, lobbies, newHost);
  });
});

export { socketApp };
