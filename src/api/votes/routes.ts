import { Router } from "express";
import Votes from "./model";

const router = Router();

router.post("/", async (req: any, res: any) => {
  const vote = req.body;
  const userID:string = vote?.userID;
  const definitionID:string = vote?.definitionID;
  const roundID:number = vote?.roundID;
  try {
    const result = await Votes.add(userID, definitionID, roundID)
    res.status(200).json({ ok: true, voteID: result });
  } catch (err:any){
    res.status(200).json({ ok: false, error: err });
  }
});

export default router;
