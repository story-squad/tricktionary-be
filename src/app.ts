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
import voteRoutes from "./api/votes/router";
const app = express();
const JSON_SIZE_LIMIT = "5mb";
const lobbies = {};

app.use(
  bodyParser.json({
    limit: JSON_SIZE_LIMIT
  })
);

app.use(helmet());
app.use(cors());
app.use(express.json());

// CRUD routes
app.get("/", (req, res) =>
  res.status(200).json({ app: "running", timestamp: Date.now() })
);
app.get("/api", (req, res) =>
  res.status(200).json({ api: "𝜋", timestamp: Date.now() })
);

app.use("/api/words", wordRoutes);
app.use("/api/definition-reactions", definitionReactionRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/votes", voteRoutes);
// web sockets
const wsApp = createServer(app);
const io = new socketIO.Server(wsApp, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // more events to come.
  socket.on("disconnecting", () => {
    console.log("Client disconnecting...")
    gameSocketHandler.handleLobbyLeave(io, socket, lobbies);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });

  socket.on("create lobby", (username:string) => {
    console.log(`${username} is creating a lobby`)
    gameSocketHandler.handleLobbyCreate(io, socket, username, lobbies);
  });

  socket.on("join lobby", (username:string, lobbyCode:string) => {
    console.log('todo')
    gameSocketHandler.handleLobbyJoin(io, socket, username, lobbyCode, lobbies);
  });

  socket.on("start game", (lobbyCode:string) => {
    console.log('todo')
    gameSocketHandler.handleStartGame(io, socket, lobbyCode, lobbies);
  });

  socket.on("definition submitted", (definition:string, lobbyCode:string) => {
    console.log('todo')
    gameSocketHandler.handleSubmitDefinition(
      io,
      socket,
      definition,
      lobbyCode,
      lobbies
    );
  });

  socket.on("guess", (lobbyCode:string, guess:any) => {
    console.log('todo')
    gameSocketHandler.handleGuess(io, socket, lobbyCode, guess, lobbies);
  });

  socket.on("play again", (lobbyCode:string) => {
    console.log('todo')
    gameSocketHandler.handlePlayAgain(io, socket, lobbyCode, lobbies);
  });

})

export { app };
