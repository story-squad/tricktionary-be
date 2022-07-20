import db from "../../dbConfig";
import { v4 } from "uuid";
import { matchWords } from "../../options/pseudoRandom";

export default { newBot, checkBot, getBotPID };

async function newBot(botID: string, botName: string, lobbyCode: string) {
  const uuId = v4();
  try {
    await db("Player").insert({
      id: uuId,
      last_user_id: botID,
      name: botName,
      last_played: lobbyCode,
    });
  } catch (err) {
    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }
  }
  return { ok: true, player_id: uuId };
}

async function getBotPID(botName: string, lobbyCode: string) {
  let botPID;

  try {
    botPID = await db("Player")
      .select("id")
      .where({ name: botName, last_played: lobbyCode })
      .first();
  } catch (err) {
    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }
  }

  return botPID;
}

async function checkBot(username: string, last_played: string) {
  const players = await db("Player").where({ last_played });
  const player_names = players.map((p: any) => p.name.toLowerCase());
  const check = matchWords(username.toLowerCase(), player_names);
  return check.length > 0;
}
