import randomizer from "randomatic";
import { LC_LENGTH, localAxios } from "./common";

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
    const last_player = await localAxios.get(`/api/player/last-user-id/${socket.id}`);
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
  console.log("GAME : ", game_id)
  localAxios.put(`/api/player/id/${og_host}`, {});
  lobbies[lobbyCode] = {
    game_id,
    lobbyCode,
    players: [{ id: socket.id, username, definition: "", points: 0 }],
    host: socket.id,
    phase: "PREGAME",
    word: "",
    definition: "",
    guesses: [],
    roundId: null
  };
  const playerId = socket.id;
  io.to(playerId).emit("welcome", playerId); // private message host with id
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  // console.log(lobbies[lobbyCode]);
}
export default handleLobbyCreate;
