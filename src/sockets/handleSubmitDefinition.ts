import axios from "axios";

async function handleSubmitDefinition(
  io: any,
  socket: any,
  definition: string,
  lobbyCode: any,
  lobbies: any
) {
  const newPlayer = lobbyCode[lobbyCode].players.find((player:any) => player.id === socket.id);
  let numSubmitted:number = 0;
  // add new definition.
  const newDef:any = await axios.post("api/definitions/new",  { playerId: newPlayer.id, definition, roundId: lobbies[lobbyCode].roundId });
  // then ...
  const definitionId = newDef?.data?.definitionId;

  // update & count number of player submissions
  lobbyCode[lobbyCode].players = lobbyCode[lobbyCode].players.map((player:any) =>{
    if (player.definition) {
      numSubmitted++;
    }
    return (player.id === newPlayer.id) ? newPlayer : player
  });

  if (!definitionId) {
    // data should contain an error message
    console.log(newDef);
  }
  if (numSubmitted === lobbyCode[lobbyCode].players.length - 1) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "GUESSING",
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  console.log(lobbies[lobbyCode]);
}

export default handleSubmitDefinition