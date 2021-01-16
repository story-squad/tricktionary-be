// const Rounds = require("../rounds/roundsModel");
// const Votes = require("../votes/votesModel");
import { localAxios } from "./common";

// module.exports = handleGuess;

async function handleGuess(
  io: any,
  socket: any,
  lobbyCode: any,
  guess: any,
  lobbies: any
) {
  if (guess === "0") {
    // add vote
    const result: any = await localAxios.post("/api/votes", {
      userID: socket.id,
      definitionID: 0,
      roundID: lobbies[lobbyCode].roundId
    });
    console.log(result);
  } else {
    const playerWhoVoted = lobbies[lobbyCode].players.find(
      (player: any) => player.id === socket.id
    );
    const playerWhoWasVotedFor = lobbies[lobbyCode].players.find(
      (player: any) => player.id === guess
    );
    // add vote
    const result: any = await localAxios.post("/api/votes", {
      userID: playerWhoVoted.id,
      definitionID: playerWhoWasVotedFor.definitionId,
      roundID: lobbies[lobbyCode].roundId
    });
    console.log(result);
  }

  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    guesses: [...lobbies[lobbyCode].guesses, { player: socket.id, guess }]
  };

  if (lobbies[lobbyCode].players.length <= lobbies[lobbyCode].guesses.length) {
    const roundId = lobbies[lobbyCode].roundId;
    // RESTful update
    const newRound: any = await localAxios.post("/api/rounds/finish", { roundId });
    if (newRound.status === 200) {
      console.log("round ended");
    }
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "POSTGAME"
    };
    lobbies[lobbyCode] = calculatePoints(lobbies[lobbyCode]);
  }
  // pub-sub update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);

  console.log(lobbies[lobbyCode]);
}

function calculatePoints(lobby: any) {
  lobby.guesses.forEach((guess: any) => {
    lobby.players.forEach((player: any) => {
      if (guess.guess === "0" && player.id === guess.player) {
        player.points++;
      } else if (guess.guess === player.id && guess.player !== player.id) {
        player.points++;
      }
    });
  });

  return lobby;
}

export default handleGuess;
