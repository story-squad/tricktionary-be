import gameSocketHandler from "./index";
import { guardHandler } from "./guardHandler";
import { log } from "../logger";

/**
 * Register the game's event listeners on a newly connected socket.
 *
 * Every listener goes through `guardHandler`, and returns its handler's
 * promise, so an error in a handler is logged instead of stopping the server.
 *
 * @param io (socket io)
 * @param socket (socket io) the connected socket
 * @param lobbies game-state
 */
export function registerGameEvents(io: any, socket: any, lobbies: any) {
  const on = (event: string, listener: (...args: any[]) => unknown) =>
    socket.on(event, guardHandler(event, socket, listener));

  // LOGIN
  on("login", (token: string | undefined) => {
    if (token && token.length > 0) {
      const handled = gameSocketHandler.handleReturningPlayer(
        io,
        socket,
        token,
        lobbies
      );
      log(`Handling returning player - token: ${token}`);
      return handled;
    } else {
      const handled = gameSocketHandler.handleNewPlayer(io, socket);
      log(`Handling new player`);
      return handled;
    }
  });
  // more events to come.
  on("disconnecting", () =>
    gameSocketHandler.handleDisconnection(io, socket, lobbies)
  );

  on("update username", (newUsername: string) =>
    gameSocketHandler.handleUpdateUsername(io, socket, lobbies, newUsername)
  );
  on("synchronize", (seconds: number) =>
    gameSocketHandler.handleTimeSync(io, socket, lobbies, seconds)
  );
  on("disconnect", () => {
    log(`Client disconnected, ${socket.id}`);
  });

  on("create lobby", (username: string) =>
    gameSocketHandler.handleLobbyCreate(io, socket, username, lobbies)
  );

  on("join lobby", (username: string, lobbyCode: string) =>
    gameSocketHandler.handleLobbyJoin(
      io,
      socket,
      username,
      lobbyCode,
      lobbies,
      false,
      false
    )
  );

  on(
    "manage alphabot",
    (botName: string, botID: string, action: string, lobbyCode: string) =>
      gameSocketHandler.handleAlphaBot(
        io,
        socket,
        botName,
        botID,
        action,
        lobbyCode,
        lobbies
      )
  );

  on("start game", (settings: any, lobbyCode: string, hostChoice: any) =>
    gameSocketHandler.handleStartGame(
      io,
      socket,
      lobbyCode,
      lobbies,
      settings,
      hostChoice
    )
  );

  on("definition submitted", (definition: string, lobbyCode: string) =>
    gameSocketHandler.handleSubmitDefinition(
      io,
      socket,
      definition,
      lobbyCode,
      lobbies
    )
  );

  on(
    "bot definition submitted",
    (definition: string, botID: string, lobbyCode: string) =>
      gameSocketHandler.handleAlphaBotSubmission(
        io,
        socket,
        definition,
        botID,
        lobbyCode,
        lobbies
      )
  );

  on("guess", (lobbyCode: string, guesses: any[]) =>
    gameSocketHandler.handleArrayOfGuesses(
      io,
      socket,
      lobbyCode,
      lobbies,
      guesses
    )
  );

  on("msg host", (message: string) =>
    gameSocketHandler.handleMessageHost(
      io,
      socket,
      lobbies,
      "msg host",
      message
    )
  );

  on("player guess", (playerId: string, definitionKey: number) =>
    gameSocketHandler.handleMessagePlayer(
      io,
      socket,
      lobbies,
      playerId,
      "player guess",
      definitionKey
    )
  );
  on("play again", (settings: any, lobbyCode: string) =>
    gameSocketHandler.handlePlayAgain(io, socket, lobbyCode, lobbies, settings)
  );

  on("set phase", (phase: string, lobbyCode: string) =>
    gameSocketHandler.handleSetPhase(io, socket, lobbyCode, lobbies, phase)
  );

  on("set host", (newHost: string, lobbyCode: string, guesses: any[]) =>
    gameSocketHandler.handleSetNewHost(
      io,
      socket,
      lobbyCode,
      lobbies,
      newHost,
      guesses
    )
  );
  on("reveal results", (lobbyCode: string, guesses: any[]) =>
    gameSocketHandler.handleRevealResults(
      io,
      socket,
      lobbyCode,
      lobbies,
      guesses
    )
  );

  on("set finale", (lobbyCode: string) =>
    gameSocketHandler.handleSetFinale(io, socket, lobbyCode, lobbies)
  );

  on("send reaction", (definitionID: number, reactionID: number) =>
    gameSocketHandler.handleEmojiSmash(
      io,
      socket,
      lobbies,
      definitionID,
      reactionID
    )
  );
  on("get reactions", () =>
    gameSocketHandler.handleGetReactions(io, socket, lobbies)
  );
  on("disconnect me", () =>
    gameSocketHandler.removeFromLobby(io, socket, lobbies)
  );
  on("remote paint", (vector: number[]) => {
    // start with a simple array of numbers
    log(`[PAINT] ${vector.map((n) => String(n))}`);
    return gameSocketHandler.handleRemotePaint(io, socket, lobbies, vector);
  });
}
