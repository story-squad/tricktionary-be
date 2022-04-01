import {
  MAX_PLAYERS,
  LC_LENGTH,
  localAxios,
  whereAmI,
  updatePlayerToken,
  privateMessage,
  getCurrentRoundIndex,
} from "./common";
import { log } from "../logger";
import handleErrorMessage from "./handleErrorMessage";
import { schedulePulseCheck } from "./crontab";
const JOINABLE = ["PREGAME", "RESULTS", "FINALE"];
/**
 * Connects the player with the active game being played.
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param username Player's name
 * @param lobbyCode Player's join code
 * @param lobbies game-state
 * @param doCheckPulse checks pulse of disconnected player
 * @param isReturning checks whether it is a retuning player or not
 */
async function handleLobbyJoin(
  io: any,
  socket: any,
  username: string,
  lobbyCode: any,
  lobbies: any,
  doCheckPulse: boolean | undefined,
  isReturning: boolean
) {
  if (whereAmI(socket) === lobbyCode.trim()) {
    io.to(lobbyCode).emit("game update", lobbies[lobbyCode]); // ask room to update
    return;
  }
  if (lobbyCode.length !== LC_LENGTH) {
    handleErrorMessage(
      io,
      socket,
      2000,
      "The lobby code you entered is not long enough"
    );
    return;
  }
  if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
    handleErrorMessage(
      io,
      socket,
      2000,
      "The lobby code you entered does not correspond to an active room"
    );
    return;
  }
  if (lobbies[lobbyCode].players.length > MAX_PLAYERS) {
    handleErrorMessage(
      io,
      socket,
      2001,
      `The lobby with code ${lobbyCode} has reached the maximum player limit of ${MAX_PLAYERS}`
    );
    return;
  }
  let p_id: any;
  try {
    // Player.id
    const { data } = await localAxios.get(`/api/auth/find-player/${socket.id}`);
    p_id = data?.id;
  } catch (err) {
    if (err instanceof Error) {
      log(err.message);
    }
  }

  if (!p_id) {
    log("!no p_id was found (corrupted token?), creating...");
    try {
      const login = await localAxios.post("/api/auth/new-player", {
        last_user_id: socket.id,
      });
      const newtoken = login.data.token;
      p_id = login.data.player_id;
      privateMessage(io, socket, "token update", newtoken);
    } catch (err) {
      if (err instanceof Error) {
        log(err.message);
      }
      return;
    }
  } else {
    log(`!found player id: ${p_id}`);
  }

  log(`p_id: ${p_id}`);

  if (!p_id) {
    log("no join for you!!!");
    return;
  }
  const otherPlayers = (): [] =>
    lobbies[lobbyCode].players
      .filter((p: any) => p.pid && p.pid !== p_id)
      .filter((p: any) => p.id && p.id !== socket.id);
  const playerReturned = (): boolean =>
    lobbies[lobbyCode].players.length > otherPlayers().length;
  // sort by points, ascending order
  function sortedDuplicates(): [] {
    return lobbies[lobbyCode].players
      .filter((player: any) => player.pid === p_id || player.id !== socket.id)
      .sort((a: any, b: any) => a.points - b.points);
  }
  function askPartyToLeave(duplicatePlayers: []) {
    // ask duplicates to leave
    duplicatePlayers.forEach((p: any) => {
      log(`suggesting 'disconnect me' -> ${p.id}`);
      io.to(p.id).emit("disconnect me"); // politely ask duplicate to leave
      socket.leave(p.id); // show duplicate to the exit
    });
    // remove from players list
    return (lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      players: otherPlayers(),
    });
  }
  let old_player_obj: any;

  if (playerReturned()) {
    const duplicates = sortedDuplicates();
    lobbies[lobbyCode] = askPartyToLeave(duplicates);
    old_player_obj = duplicates.pop(); // most points
  }
  let uname =
    old_player_obj?.username?.length > 0 ? old_player_obj.username : username;
  // update the token,
  let points =
    Number(old_player_obj?.points) >= 0 ? Number(old_player_obj.points) : 0;
  await updatePlayerToken(io, socket, p_id, uname, "", points, lobbyCode);

  if (lobbies[lobbyCode]?.phase in JOINABLE && !old_player_obj) {
    // prevent *new players from joining mid-game.
    handleErrorMessage(
      io,
      socket,
      2002,
      `Unfortunately, the lobby with code ${lobbyCode} has already begun their game`
    );
    return;
  }

  log(`${username} ${old_player_obj ? "re-joined" : "joined"} ${lobbyCode}`);

  // Get current round index
  const curRoundIndex = getCurrentRoundIndex(lobbies, lobbyCode);

  // add player to lobby data
  if (old_player_obj) {
    // re-construct the old player object, setting connected to true, with our new id
    // re-join
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      players: [
        ...lobbies[lobbyCode].players.filter((p: any) => p.id !== socket.id),
        { ...old_player_obj, id: socket.id, connected: true, pid: p_id },
      ],
    };
  } else {
    // this player is new
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      players: [
        ...lobbies[lobbyCode].players,
        {
          id: socket.id,
          username,
          definition: "",
          points: 0,
          connected: true,
          pid: p_id,
          playerPlacing: 0,
        },
      ],
    };

    lobbies[lobbyCode].rounds[curRoundIndex] = {
      roundNum: lobbies[lobbyCode].rounds[curRoundIndex].roundNum,
      scores: [
        ...lobbies[lobbyCode].rounds[curRoundIndex].scores,
        { playerId: socket.id, score: 0 },
      ],
    };
  }
  // join socket to room
  socket.join(lobbyCode);
  // send welcome message
  privateMessage(io, socket, "welcome", socket.id);
  // ask room to update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
  if (doCheckPulse) {
    log("PULSE CHECK");
    try {
      schedulePulseCheck(io, lobbies, lobbyCode, 5);
    } catch (err) {
      log("ERROR scheduling pulse check");
    }
  }

  // Send notification to host
  let notificationData;

  if (isReturning) {
    notificationData = {
      message: "Player Re-Joined",
      description: `Player "${username}" has re-joined the party`,
      className: "player-rejoined",
    };
  } else {
    notificationData = {
      message: "Player Joined",
      description: `Player "${username}" has joined the fray`,
      className: "player-joined",
    };
  }

  io.emit("receive-notification", notificationData);
}

export default handleLobbyJoin;
