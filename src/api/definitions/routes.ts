import { Router } from "express";
import Definitions from "./model";
import { DefinitionType } from "./utils";
import { log } from "../../logger";

const router = Router();

router.post("/new", async (req, res) => {
  const { playerId, definition, roundId, pid, game_id } = req.body;
  let result: any;
  let defId: number = -1;
  try {
    result = await Definitions.add(playerId, pid, definition, roundId, game_id);
    defId = result.pop();
  } catch (err: any) {
    log("error! definitions router");
    log(err.message);
  }
  if (defId > -1) {
    res.status(201).json({ definitionId: defId });
  } else {
    res.status(400).json({ error: "failed to get definition Id" });
  }
});

/**
 * @returns { user_id, round_id, definition }
 */
router.get("/user/:uid/round/:rid", async (req, res) => {
  const user_id = req.params.uid;
  const round_id = Number(req.params.rid);
  let definition: DefinitionType;
  let id: number | undefined;
  try {
    // player's definition this round
    definition = await Definitions.byUserInRound(user_id, round_id);
    id = definition.id;
  } catch (err: any) {
    // a blank definition object
    definition = {
      user_id,
      round_id,
      definition: "",
    };
  }
  res.status(200).json({
    id,
    user_id,
    round_id,
    definition,
  });
});

router.put("/increase/game/:game_id/round/:round_id", async (req, res) => {
  const game_id: string = req.params.game_id;
  const round_id: number = Number(req.params.round_id);
  const ok_round: boolean = round_id > 0;
  const ok_game: boolean = game_id?.length > 0;
  if (!ok_round || !ok_game) {
    return res.status(404).json({ error: "whatcha loooking for holmes?" });
  }
  const points: number = req.body.points;
  const player_id: string = req.body.player_id;
  if (!(points > 0)) {
    return res.status(400).json({ error: "points must be > 0" });
  }
  if (!(player_id.length > 0)) {
    return res.status(400).json({ error: "player who ?" });
  }
  try {
    await Definitions.incr(player_id, round_id, points);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
  res.status(200).json({ ok: true });
});

router.get("/round/:round_id", async (req, res) => {
  const round_id: number = Number(req.params.round_id);
  let data: any;
  try {
    data = Definitions.thisRound(round_id);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/game/:game_id/player/:player_id", async (req, res) => {
  const game_id: string = req.params.game_id;
  const player_id: string = req.params.player_id;
  const result = await Definitions.findTopDefinition(player_id, game_id);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({ top_definition: result.top_definition });
});

router.get("/id/:id", async (req, res) => {
  const definitionId: number = Number(req.params.id);
  let definition: DefinitionType;
  try {
    definition = await Definitions.byId(definitionId).first();
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  return res.status(200).json({ ok: true, definition });
});

export default router;
