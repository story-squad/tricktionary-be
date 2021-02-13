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
    } catch (err) {
      // None of the guys go steady 'cause it wouldn't be right
      res.status(400).json({ error: err }); // To leave their best girl home now on Saturday night
    }
  }
});

router.post("/recordchoice", async (req, res) => {
  const { word_id_one, word_id_two, round_id, times_shuffled } = req.body;
  let result: any;
  let choice_id: number = -1;
  console.log(Super);
  try {
    result = await Super.addHostChoice(
      word_id_one,
      word_id_two,
      round_id,
      times_shuffled
    );
    choice_id = result.pop();
  } catch (err) {
    // console.log('error', err)
    console.log("error recording the host choice");
  }
  if (choice_id > -1) {
    res.status(201).json({ choice_id: choice_id });
  } else {
    res.status(400).json({ error: "failed to get choice Id" });
  }
});

router.get("/choice/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Super.getHostChoiceById(id)
    .then((choice) => {
      res.status(200).json({ choice });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/word/:word_id/passovers", async (req, res) => {
  const id = Number(req.params.word_id);
  if (!id) res.status(400).json({ error: "id?" });
  Super.getPassoversForWord(id)
    .then((passovers) => {
      res.status(200).json({ passovers });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
export default router;
