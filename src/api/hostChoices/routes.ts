import { Router } from "express";
import choiceModel from "./model";
import { log } from "../../logger";
const router = Router();

router.post("/", async (req, res) => {
  const { word_id_one, word_id_two, round_id, times_shuffled } = req.body;
  let result: any;
  let choice_id: number = -1;
  try {
    result = await choiceModel.addHostChoice(
      word_id_one,
      word_id_two,
      round_id,
      times_shuffled
    );
    choice_id = result.pop();
  } catch (err) {
    log("error recording the host choice");
    log(err.message);
  }
  if (choice_id > -1) {
    res.status(201).json({ choice_id: choice_id });
  } else {
    res.status(404).json({ error: "failed to get choice Id" });
  }
});

router.get("/id/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  choiceModel
    .getHostChoiceById(id)
    .then((choice) => {
      res.status(200).json({ choice });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
export default router;
