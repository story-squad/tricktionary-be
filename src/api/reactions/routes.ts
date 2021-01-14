import { Router } from "express";
import Reactions from "./model";

const router = Router();

router.get("/", async (req, res) => {
  // return a list of available reactions.
  const available = await Reactions.getAll();
  res.status(200).json({ available });
});

export default router;
