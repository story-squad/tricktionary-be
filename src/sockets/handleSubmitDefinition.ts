import { localAxios } from "./common";

async function handleSubmitDefinition(
  io: any,
  socket: any,
  definition: string,
  lobbyCode: any,
  lobbies: any
) {
  const newPlayer = lobbies[lobbyCode].players.find((player:any) => player.id === socket.id);
  let numSubmitted:number = 0;
  // add new definition.
  let newDef:any;
  try {
    console.log(newPlayer)
    newDef = await localAxios.post("/api/definitions/new",  { playerId: newPlayer.id, definition, roundId: lobbies[lobbyCode].roundId });
  } catch(err){

    console.log("errror! handleSubmitDefinitions:17")
  }
  // then ...
  console.log(newDef.data)
  const definitionId = newDef?.data?.definitionId;

  // update & count number of player submissions
  lobbies[lobbyCode].players = lobbies[lobbyCode].players.map((player:any) =>{
    if (player.definition) {
      numSubmitted++;
    }
    return (player.id === newPlayer.id) ? newPlayer : player
  });

  if (!definitionId) {
    // data should contain an error message
    console.log(newDef);
  }
  if (numSubmitted === lobbies[lobbyCode].players.length - 1) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "GUESSING",
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  console.log(lobbies[lobbyCode]);
}

export default handleSubmitDefinition