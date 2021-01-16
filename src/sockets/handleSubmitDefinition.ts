import { localAxios } from "./common";

async function handleSubmitDefinition(
  io: any,
  socket: any,
  definition: string,
  lobbyCode: any,
  lobbies: any
) {
  const newPlayer:any = await lobbies[lobbyCode].players.find((player:any) => player.id === socket.id);
  // console.log(`SOCKET ID: ${socket.id}`)
  // console.log(`NEW PLAYER: ${newPlayer}`)
  let numSubmitted:number = 0;
  // add new definition.
  let newDef:any;
  try {
    // console.log(newPlayer)
    newPlayer.definition = definition
    numSubmitted++;
    newDef = await localAxios.post("/api/definitions/new",  { playerId: newPlayer.id, definition, roundId: lobbies[lobbyCode].roundId });
  } catch(err){
    console.log("errror! handleSubmitDefinitions:22")
  }
  // then ...
  const definitionId = newDef?.data?.definitionId;
  // console.log(`ok, definition id: ${definitionId}`)

  // update & count number of player submissions
  lobbies[lobbyCode].players = lobbies[lobbyCode].players.map((player:any) =>{
    if (player.definition && player.id !== newPlayer.id) {
      numSubmitted++;
    }
    return (player.id === newPlayer.id) ? newPlayer : player
  });

  if (!definitionId) {
    // data should contain an error message
    console.log(newDef);
  }
  console.log(`VOTES: ${numSubmitted} PLAYERS: ${lobbies[lobbyCode].players.length}`)
  if (numSubmitted === lobbies[lobbyCode].players.length) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "GUESSING",
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  // console.log(lobbies[lobbyCode]);
}

export default handleSubmitDefinition