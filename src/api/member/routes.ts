import { Router } from "express";
import Member from "./model";

const router = Router();

router.post("/new", async (req, res) => {
  const { email, username, fullname, location, external } = req.body;
  let createMember;
  const memberId: string = "ERROR CREATING MEMBERSHIP";
  try {
    createMember = await Member.add(
      email,
      username,
      fullname,
      location,
      external
    );
    // member_id = createMember.member_id;
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
  res.status(200).json({ member_id: createMember?.member_id || memberId });
});

// todo: findby email, findby member_id

// todo: integrate OktaProfile

export default router;
