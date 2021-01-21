import { Router } from "express";
import Reactions from "./model";

const router = Router();

router.get("/", async (req, res) => {
  // return a list of available reactions.
  let available;
  try {
    available = await Reactions.getAll();
    res.status(200).json({ available });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

export default router;
