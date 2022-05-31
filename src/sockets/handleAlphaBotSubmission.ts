import { localAxios } from "./common";
import handleErrorMessage from "./handleErrorMessage";
import { log } from "../logger";

/**
 * Handles the addition/removal of bots in the game
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param definition Bot's definition submission
 * @param botID Bot's ID
 * @param lobbyCode Bot's join code
 * @param lobbies game-state
 */

async function handleAlphaBotSubmission(
  io: any,
  socket: any,
  definition: string,
  botID: string,
  lobbyCode: any,
  lobbies: any
) {
  const definitionEpoch = Date.now(); // add a timestamp to the player for tie-breaking
  let newPlayer: any = await lobbies[lobbyCode].players.find(
    (player: any) => player.id === botID
  );
  const game_id = lobbies[lobbyCode].game_id;
  let numSubmitted: number = 0;
  // add new definition.
  let newDef: any;
  try {
    console.log("Bot submission data", newPlayer);
    newPlayer.definition = definition;
    numSubmitted++;
    newDef = await localAxios.post("/api/definitions/new", {
      playerId: newPlayer.id,
      definition,
      roundId: lobbies[lobbyCode].roundId,
      pid: newPlayer.pid,
      game_id,
    });
  } catch (err:any){
    log("errror! handleAlphaBotSubmission:22");

    log(`There was a server error while ${botID} submitted their definition.`);
  }
  // then ...
  const definitionId = newDef?.data?.definitionId;
  if (!definitionId) {
    // error submitting definition,
    log(`There was a server error while ${botID} submitted their definition.`);
  }
  newPlayer = { ...newPlayer, definitionId, definitionEpoch }; // store definition id
  // update & count number of player submissions
  lobbies[lobbyCode].players = lobbies[lobbyCode].players.map((player: any) => {
    if (player.definition && player.id !== newPlayer.id) {
      numSubmitted++;
    }
    return player.id === newPlayer.id ? newPlayer : player;
  });

  if (!definitionId) {
    log(newDef);
  }
  log(`Definitions: ${numSubmitted}/${lobbies[lobbyCode].players.length}`);
  if (numSubmitted === lobbies[lobbyCode].players.length) {
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      phase: "GUESSING",
    };
  }
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

export default handleAlphaBotSubmission;
