import axios from "axios";

async function handleStartGame(io: any, socket: any, lobbyCode: any, lobbies: any) {
  const phase:string = "WRTITING";
  // get random word
  const { data } = await axios.get("/api/words");
  const word = {
    id: data?.id,
    word: data?.word,
    definition: data?.definition || null
  }
  // guard
  if (!word || !word.id) return false
  // start a new round
  const newRound:any = await axios.post("api/rounds/start",  { lobby: lobbies[lobbyCode], wordId: word.id });
  const roundId = newRound?.data?.roundId;
  if (!roundId) return false
  // set phasers to "WRITING" and update the game state
  lobbies[lobbyCode] = {
    ...lobbies[lobbyCode],
          phase,
          word: word.word,
          definition: word.definition,
          roundId
  }
  // REST-ful update
  const result:any = await axios.post("api/user-rounds/add-players", {players: lobbyCode[lobbyCode].players, roundId});
  if (result.status === 201) {
    console.log('game update...')
    // pub-sub update
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  } else {
    console.log("error updating game")
    console.log(result)
  }
}

export default handleStartGame;