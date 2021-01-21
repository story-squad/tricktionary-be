import { localAxios } from "./common";
import handleErrorMessage from "./handleErrorMessage";

async function handleGuess(
  io: any,
  socket: any,
  lobbyCode: any,
  guess: any,
  reactions: any[] | undefined,
  lobbies: any
) {
  if (guess === "0") {
    // add vote
    // console.log('player chose correctly!')
    try {
      await localAxios.post("/api/votes", {
        userID: socket.id,
        definitionID: Number(guess),
        roundID: lobbies[lobbyCode].roundId
      });
    } catch (err) {
      console.log("ERROR voting correctly.");
      handleErrorMessage(io, socket, err);
    }
  } else {
    const playerWhoVoted = lobbies[lobbyCode].players.find(
      (player: any) => player.id === socket.id
    );
    const playerWhoWasVotedFor = lobbies[lobbyCode].players.find(
      (player: any) => player.definitionId === Number(guess)
    );
    // add vote
    try {
      await localAxios.post("/api/votes", {
        userID: playerWhoVoted.id,
        definitionID: Number(playerWhoWasVotedFor.definitionId),
        roundID: lobbies[lobbyCode].roundId
      });
    } catch (err) {
      console.log("error voting incorrectly.");
      handleErrorMessage(io, socket, err);
    }
    // console.log(result);
  }
  if (reactions && reactions?.length > 0) {
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
    })
  }

  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    guesses: [...lobbies[lobbyCode].guesses, { player: socket.id, guess }]
  };
  console.log(
    `Guesses: ${lobbies[lobbyCode].guesses.length}/${lobbies[lobbyCode].players.length}`
  );
  if (lobbies[lobbyCode].players.length === lobbies[lobbyCode].guesses.length) {
    const roundId = lobbies[lobbyCode].roundId;
    // RESTful update
    let newRound: any;
    try {
      newRound = await localAxios.post("/api/round/finish", { roundId });
      if (newRound.status === 200) {
        console.log(`* end of round ${roundId}`);
      }
    } catch (err) {
      console.log("error while ending round!");
      handleErrorMessage(io, socket, err);
      // console.log(err, newRound)
    }
    lobbies[lobbyCode] = {
      ...calculatePoints(lobbies[lobbyCode]),
      phase: "POSTGAME"
    };
  }
  // pub-sub update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  // console.log(lobbies[lobbyCode]);
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
