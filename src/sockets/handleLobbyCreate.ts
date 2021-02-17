import randomizer from "randomatic";
import {
  LC_LENGTH,
  localAxios,
  privateMessage,
  updatePlayerToken
} from "./common";

async function handleLobbyCreate(
  io: any,
  socket: any,
  username: string,
  lobbies: any
) {
  const lobbyCode = randomizer("A", LC_LENGTH);
  socket.join(lobbyCode);
  let og_host;
  let request_game;
  let game_id;
  try {
    const last_player = await localAxios.get(
      `/api/player/last-user-id/${socket.id}`
    );
    // console.log(last_player.data);
    if (last_player.data.player && last_player.data.player.id) {
      // create the Game
      og_host = last_player.data.player.id;
      request_game = await localAxios.post(`/api/game/new`, { og_host });
      if (request_game?.data.ok) {
        game_id = request_game?.data.game_id;
      }
    }
  } catch (err) {
    console.log({ message: err.message });
  }
  console.log("LOBBY CREATED BY: ", og_host);
  console.log("GAME : ", game_id);
  lobbies[lobbyCode] = {
    game_id,
    lobbyCode,
    players: [
      { id: socket.id, username, definition: "", points: 0, connected: true }
    ],
    host: socket.id,
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    roundId: null
  };
  try {
    await updatePlayerToken(io, socket, og_host, username, "", 0, lobbyCode);
  } catch (err) {
    console.log(err.message);
  }
  privateMessage(io, socket, "welcome", socket.id);
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}
export default handleLobbyCreate;
