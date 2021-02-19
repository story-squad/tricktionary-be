import { GameSettings } from "../GameSettings";

function handlePlayAgain(io: any, socket: any, lobbyCode: any, lobbies: any, settings: any) {
  const updated = GameSettings(settings);
  // todo
  if (!lobbyCode[lobbyCode]) {
    return
  }
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
    players: lobbies[lobbyCode].players.map((player:any) => {
      return {
        ...player,
        definition: "",
      };
    }),
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    settings: updated
  };
  io.to(lobbyCode).emit("play again", lobbies[lobbyCode]);
  // console.log(lobbies[lobbyCode]);
}

export default handlePlayAgain