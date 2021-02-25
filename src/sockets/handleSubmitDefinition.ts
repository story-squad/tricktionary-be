import { localAxios } from "./common";
import handleErrorMessage from "./handleErrorMessage";

async function handleSubmitDefinition(
  io: any,
  socket: any,
  definition: string,
  lobbyCode: any,
  lobbies: any
) {
  let newPlayer:any = await lobbies[lobbyCode].players.find((player:any) => player.id === socket.id);
  let numSubmitted:number = 0;
  // add new definition.
  let newDef:any;
  try {
    newPlayer.definition = definition
    numSubmitted++;
    newDef = await localAxios.post("/api/definitions/new",  { playerId: newPlayer.id, definition, roundId: lobbies[lobbyCode].roundId });
  } catch(err){
    console.log("errror! handleSubmitDefinitions:22")
    handleErrorMessage(io, socket, 2003, 'There was a server error while submitting your definition.');
  }
  // then ...
  const definitionId = newDef?.data?.definitionId;
  newPlayer = {...newPlayer, definitionId }; // store definition id
  // update & count number of player submissions
  lobbies[lobbyCode].players = lobbies[lobbyCode].players.map((player:any) =>{
    if (player.definition && player.id !== newPlayer.id) {
      numSubmitted++;
    }
    return (player.id === newPlayer.id) ? newPlayer : player
  });

  if (!definitionId) {
    console.log(newDef);
  }
  console.log(`Definitions: ${numSubmitted}/${lobbies[lobbyCode].players.length}`)
  if (numSubmitted === lobbies[lobbyCode].players.length) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "GUESSING",
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

export default handleSubmitDefinition