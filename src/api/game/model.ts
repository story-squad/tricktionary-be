
import db from "../../dbConfig";
import { v4 } from "uuid";
export default { add };

async function add(og_host: string) {
  const uuId = v4();
  let game_req;
  try {
    game_req = await db("Game").insert({ 
      id: uuId,
      og_host
     }).returning("id");
  } catch (err) {
    return {ok: false, message: 'error'}
  }
  return {ok: true, game_id: game_req[0]}
}

