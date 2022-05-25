import { log } from "../logger";
import { LC_LENGTH, getCurrentRoundIndex, localAxios } from "./common";
import { v4 } from "uuid";

/**
 * Handles the addition/removal of bots in the game
 *
 * @param io (socket io)
 * @param socket (socket io)
 * @param botName Bot's name
 * @param botID Bot's ID
 * @param action whether we are removing or adding a bot
 * @param lobbyCode Bot's join code
 * @param lobbies game-state
 */

async function handleAlphaBot(
  io: any,
  socket: any,
  botName: string,
  botID: string,
  action: string,
  lobbyCode: any,
  lobbies: any
) {
  //* Specify which phases are joinable
  const JOINABLE = ["PREGAME", "FINALE"];

  //* Check if the lobby code is valid
  if (lobbyCode.length !== LC_LENGTH) {
    log(
      `The lobby code in which the bot ${botName} is entering is not long enough`
    );
    return;
  }

  //* Check if the lobby with the provided lobby code exists
  if (Object.keys(lobbies).filter((lc) => lc === lobbyCode).length === 0) {
    log(
      `The lobby code in which the bot ${botName} is entering does not correspond to an active room`
    );
    return;
  }

  //* Ensure we can add the bot only if the state of the game is joinable
  if (lobbies[lobbyCode]?.phase in JOINABLE) {
    log(
      `The lobby in which the bot ${botName} is entering has already begun their game and cannot join`
    );
    return;
  }

  //* Get current round index
  const curRoundIndex = getCurrentRoundIndex(lobbies, lobbyCode);

  //* Either add or remove the bot from the list
  if (action === "add") {
    // Let's check if bot data is in DB for the current round
    // If bot does not exist, create a record for it on the DB
    const botExists = await localAxios.get(
      `/api/bot/namecheck/${botName}/${lobbyCode}`
    );

    let botPID;
    let login;

    if (botExists.data) {
      try {
        login = await localAxios.get(`/api/bot/botpid/${botName}/${lobbyCode}`);

        console.log(login.data);
        botPID = login?.data.id;
      } catch (err:any){
        if (err instanceof Error) {
          return { ok: false, message: err.message };
        }
      }

      log(
        `The bot ${botName}, with ID ${botID} has been re-added to game ${lobbyCode}`
      );
    } else {
      try {
        const last_user_id = botID;
        login = await localAxios.post("/api/bot/new-bot", {
          last_user_id,
          botName,
          lobbyCode,
        });

        botPID = login?.data.pid;
      } catch (err:any){
        if (err instanceof Error) {
          return { ok: false, message: err.message };
        }
      }

      log(
        `The bot ${botName}, with ID ${botID} has been added to game ${lobbyCode}`
      );
    }

    // Add bot to bots list
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      bots: [
        ...lobbies[lobbyCode].bots,
        {
          id: botID,
          botName: botName,
        },
      ],
      players: [
        ...lobbies[lobbyCode].players,
        {
          id: botID,
          username: botName,
          definition: "",
          points: 0,
          connected: true,
          pid: botPID,
        },
      ],
    };

    // Add bot to the round player list
    lobbies[lobbyCode].rounds[curRoundIndex] = {
      roundNum: lobbies[lobbyCode].rounds[curRoundIndex].roundNum,
      scores: [
        ...lobbies[lobbyCode].rounds[curRoundIndex].scores,
        { playerId: botID, score: 0 },
      ],
    };
  } else {
    // Remove the bot from the bot list
    lobbies[lobbyCode] = {
      ...lobbies[lobbyCode],
      bots: [...lobbies[lobbyCode].bots.filter((b: any) => b.id !== botID)],
      players: [
        ...lobbies[lobbyCode].players.filter((b: any) => b.id !== botID),
      ],
    };

    // Add bot to the round player list
    lobbies[lobbyCode].rounds[curRoundIndex] = {
      ...lobbies[lobbyCode].rounds[curRoundIndex],
      scores: [
        ...lobbies[lobbyCode].rounds[curRoundIndex].scores.filter(
          (b: any) => b.playerId !== botID
        ),
      ],
    };

    log(
      `The bot ${botName}, with ID ${botID} has been removed from game ${lobbyCode}`
    );
  }

  // ask room to update
  io.to(lobbyCode).emit("game update", lobbies[lobbyCode]);
}

export default handleAlphaBot;
