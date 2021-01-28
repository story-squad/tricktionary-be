import { localAxios, playerIsHost } from "./common";
import handleErrorMessage from "./handleErrorMessage";

export async function handleArrayOfGuesses(
  io: any,
  socket: any,
  lobbyCode: any,
  lobbies: any,
  guesses: any[]
) {
  const lobby = lobbies[lobbyCode];
  const roundId = lobby.roundId;
  console.log('vote & calculate scores');
  guesses.forEach(async (g) => {
    try {
      localAxios.post("/api/votes", {
        userID: g.player,
        definitionID: g.guess,
        roundID: roundId
      })
      .then(() => {
        lobby.players.forEach((player: any) => {
          if (g.guess === 0 && player.id === g.player) {
            player.points++; // +1 if you voted for the provided definition.
          } else if (g.guess === player.definitionId && g.player !== player.id) {
            player.points++; // +1 if someone else voted for your definition.
          }
        });
      })
    } catch (err) {
      console.log("error: handleArrayOfGuesses, ${err}");
    }
  });
  try {
    const newRound = await localAxios.post("/api/round/finish", { roundId });
    if (newRound.status === 200) {
      console.log(`* end of round ${roundId}`);
    }
  } catch (err) {
    console.log("error while ending round!");
    handleErrorMessage(io, socket, err);
    return;
  }
  console.log('changing phase');
  lobbies[lobbyCode].phase = "RESULTS";
  // pub-sub update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

async function handleGuess(
  io: any,
  socket: any,
  lobbyCode: any,
  guess: any,
  reactions: any[] | undefined,
  lobbies: any
) {
  // prepare the object
  const vote = {
    userID: socket.id,
    definitionID: Number(guess),
    roundID: lobbies[lobbyCode].roundId
  };
  // try to POST it
  try {
    await localAxios.post("/api/votes", vote);
  } catch (err) {
    console.log("error voting. (handleGuess)");
    handleErrorMessage(io, socket, err);
  }
  if (reactions && reactions?.length > 0) {
    // try POST'ing reactions, if they exist.
    reactions.forEach(async (definition) => {
      try {
        await localAxios.post("/api/definition-reactions", {
          user_id: socket.id,
          round_id: lobbies[lobbyCode].roundId,
          reaction_id: Number(definition.reaction),
          definition_id: Number(definition.id),
          game_finished: false
        });
      } catch (err) {
        console.log("error reacting to definition.");
        handleErrorMessage(io, socket, err);
      }
    });
  }
  const hostingThisRound = playerIsHost(socket, lobbyCode, lobbies).ok;
  const votesCollected = `Guesses: ${lobbies[lobbyCode].guesses.length}/${lobbies[lobbyCode].players.length}`;
  const guesses = hostingThisRound
    ? [...lobbies[lobbyCode].guesses, { player: socket.id, guess }]
    : [{ message: votesCollected }];
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    guesses
  };
  console.log(votesCollected);
  if (lobbies[lobbyCode].players.length === lobbies[lobbyCode].guesses.length) {
    // when all players have voted...
    const roundId = lobbies[lobbyCode].roundId;
    // RESTful update
    let newRound: any;
    // end this round
    try {
      newRound = await localAxios.post("/api/round/finish", { roundId });
      if (newRound.status === 200) {
        console.log(`* end of round ${roundId}`);
      }
    } catch (err) {
      console.log("error while ending round!");
      handleErrorMessage(io, socket, err);
    }
    if (hostingThisRound) {
      lobbies[lobbyCode] = calculatePoints(lobbies[lobbyCode]);
    }
    // change to next game phase.
    lobbies[lobbyCode].phase = "RESULTS";
  }
  // pub-sub update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

function calculatePoints(lobby: any) {
  lobby.guesses.forEach((guess: any) => {
    lobby.players.forEach((player: any) => {
      if (guess.guess === "0" && player.id === guess.player) {
        player.points++; // +1 if you voted for the provided definition.
      } else if (guess.guess === player.id && guess.player !== player.id) {
        player.points++; // +1 if someone else voted for your definition.
      }
    });
  });

  return lobby;
}

export default handleGuess;
