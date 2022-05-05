import { validNumber } from "../words/utils";
import { Router } from "express";
import Super from "./model";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ ok: true, message: "administrative routes" });
});

/**
 * GET /round/:id
 * (Round round)
 * I get a round
 */
router.get("/round/:id", async (req, res) => {
  const roundId = req.params.id;
  if (validNumber(roundId)) {
    try {
      const result = await Super.getRound(Number(roundId)); // We always take my car 'cause it's never been beat
      res.status(200).json(result); // And we've never missed yet with the girls we meet
    } catch (err: any) {
      // None of the guys go steady 'cause it wouldn't be right
      res.status(400).json({ error: err }); // To leave their best girl home now on Saturday night
    }
  }
});

router.get("/word/:word_id", async (req, res) => {
  const id = Number(req.params.word_id);
  if (!id) res.status(400).json({ error: "id?" });
  Super.getWordDetails(id)
    .then((details) => {
      res.status(200).json({ details });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// I'm pretty sure this works but don't have any definitions to test with
router.get("/definition/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Super.getDefinitionDetails(id)
    .then((details) => {
      res.status(200).json({ details });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/topdefinitions", async (req, res) => {
  Super.getTopVotedDefinitions()
    .then((definitions) => {
      res.status(200).json(definitions);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
export default router;
