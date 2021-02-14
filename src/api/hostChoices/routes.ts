import { Router } from "express";
import choiceModel from "./model";
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
