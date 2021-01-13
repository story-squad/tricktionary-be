import { Router } from "express";
import Words from "./model";
import { validateWord } from "./utils";

const router = Router();

/*
 * This route is for adding words to the database in bulk. Expects a JSON array in the following format:
 *
 * [
 *   { word1: definition },
 *   { word2: definition },
 *   ...
 * ]
 */
router.post("/json", (req, res) => {
  const words = req.body;
  let added: number = 0;
  let skipped: number = 0;

  // begin for-loop
  words.forEach((pair: any) => {
    const [[word, definition]] = Object.entries(pair);
    const result = validateWord({ word, definition });
    if (result.ok) {
      Words.add(result.value)
        .then(() => true)
        .catch((err) => {
          console.log(result.value, err.message);
        });
      added++;
    } else {
      console.log(result.message);
      skipped++;
    }
  }); // end for-loop

  res.status(201).json({ added, skipped });
});

/**
 * GET / returns a random approved word
 */
router.get("/", (req, res) => {
  Words.getApprovedWords()
    .then((possibleWords) => {
      const index = Math.floor(Math.random() * possibleWords.length);
      res.status(200).json({ word: possibleWords[index] });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * GET /unmoderated
 */
router.get("/unmoderated", (req, res) => {
  Words.getUnmoderatedWord()
    .then((word) => {
      res.status(200).json(word);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * PUT /:id
 * update a word, by ID
 */
router.put("/:id", (req, res) => {
  const changes = req.body;
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Words.update(id, changes)
    .then((word) => {
      res.status(200).json({ updated: word });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * PUT /:id/approve
 * Approve a word, by ID
 */
router.put("/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Words.getById(id).then((wordObj) => {
    wordObj = {
      ...wordObj,
      moderated: true,
      approved: true
    };

    Words.update(id, wordObj)
      .then((word) => {
        res.status(200).json({ word });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
});

/**
 * put /:id/reject
 * Reject a word, by ID
 */
router.put("/:id/reject", (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Words.getById(id).then((wordObj) => {
    wordObj = {
      ...wordObj,
      moderated: true,
      approved: false,
    };

    Words.update(id, wordObj)
      .then((word) => {
        res.status(200).json({ word });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
});


// module.exports = router;
export default router;
