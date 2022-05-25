import { Router } from "express";
import authRequired from "../middleware/oktaRequired";
import Profiles from "./oktaProfileModel";
import { log } from "../../logger";
const router = Router();

router.get("/", authRequired, function (req, res) {
  Profiles.findAll()
    .then((profiles) => {
      res.status(200).json(profiles);
    })
    .catch((err) => {
      log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get("/:id", authRequired, function (req, res) {
  const id = String(req.params.id);
  Profiles.findById(id)
    .then((profile) => {
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ error: "ProfileNotFound" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/", authRequired, async (req, res) => {
  const profile = req.body;
  if (profile) {
    const id = profile.id || 0;
    try {
      await Profiles.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //profile not found so lets insert it
          await Profiles.create(profile).then((profile) =>
            res
              .status(200)
              .json({ message: "profile created", profile: profile[0] })
          );
        } else {
          res.status(400).json({ message: "profile already exists" });
        }
      });
    } catch (e:any) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: "Profile missing" });
  }
});

router.put("/", authRequired, async (req, res) => {
  const profile = req.body;
  if (profile) {
    const id = profile.id || 0;
    try {
      await Profiles.findById(id).then(async () => {
        const updated = await Profiles.update(id, profile);
        res
          .status(200)
          .json({ message: "profile updated", profile: updated[0] });
      });
    } catch (e:any) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: "Profile missing" });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  try {
    Profiles.findById(id).then((profile) => {
      Profiles.remove(profile.id).then(() => {
        res
          .status(200)
          .json({ message: `Profile '${id}' was deleted.`, profile: profile });
      });
    });
  } catch (err:any){
    res.status(500).json({
      message: `Could not delete profile with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
