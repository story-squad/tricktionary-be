import { Router } from "express";
import { cleverStudentRequired } from "../middleware/cleverRequired";

const router = Router();

router.get("/", cleverStudentRequired, (req: any, res: any) => {
  res.status(200).json({ok: true, message: "Clever student verified."});
});

export default router;