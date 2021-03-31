import db from "../../dbConfig";
import { v4 } from "uuid";
export default { add, get, latest, leaderBoard };

async function add(og_host: string) {
  const uuId = v4();
  let game_req;
  try {
    game_req = await db("Game")
      .insert({
        id: uuId,
        og_host,
      })
      .returning("id");
  } catch (err) {
    return { ok: false, message: "error" };
  }
  return { ok: true, game_id: game_req[0] };
}

async function get() {
  let result;
  try {
    result = await db("Game").returning("id");
  } catch (err) {
    return { ok: false, message: "error" };
  }
  return { ok: true, games: result };
}

async function latest(limit: number) {
  let result;
  try {
    result = await db("Game").orderBy("created_at", "desc").limit(limit);
  } catch (err) {
    return { ok: false, message: "error" };
  }
  return { ok: true, games: result };
}

async function leaderBoard(game_id: string) {
  try {
    return await db("score")
      .join("definitions", "definitions.id", "score.top_definition_id")
      .join("Player", "Player.id", "definitions.player_id")
      .join("Rounds", "Rounds.id", "definitions.round_id")
      .join("Words", "Words.id", "Rounds.word_id")
      .select(
        "Player.id as player_id",
        "Player.name as name",
        "score.points as score",
        "score.top_definition_id as top_definition_id",
        "definitions.definition as top_definition",
        "definitions.score as top_definition_score",
        "Words.word as word"
      )
      .whereNot({ top_definition_id: null })
      .where("score.game_id", game_id);
  } catch (err) {
    console.log(err.message);
    return [];
  }
}
