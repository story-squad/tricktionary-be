import { Router } from "express";
import Words from "./model";
import { validateWord, validNumber, range } from "./utils";

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

router.post("/contribute", (req, res) => {
  const result = validateWord(req.body);
  let duplicate: any;
  if (!result.ok) {
    return res.status(400).json({ error: result.message });
  }
  Words.getByName(result.value.word).then((dup) => {
    duplicate = dup?.id ? dup : false;
    console.log(`duplicate: ${duplicate.word}`);
    if (!duplicate) {
      // add to database
      Words.add(result.value)
        .then(([id]) => {
          // return id of new record
          res.status(201).json({ id });
        })
        .catch((err) => {
          // error adding to database
          console.log("ERROR: /contribute");
          res.status(400).json({ error: err });
        });
    } else {
      // return id of existing record
      res.status(200).json({ id: dup.id });
    }
  });
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

router.get("/by-name/:word", (req, res) => {
  const word = req.params.word;
  Words.getByName(word).then((value) => res.status(200).json(value));
});
/**
 * GET / returns a scoop of n-many random approved word
 */
router.get("/scoop/:count", (req, res) => {
  const numberOfWords: any = req.params.count;
  const nw = validNumber(numberOfWords) ? Number(numberOfWords) : 1;
  const scoops = validNumber(process.env.SCOOP_SIZE)
    ? Number(process.env.SCOOP_SIZE)
    : 0;
  const hardLimit = scoops > 0 ? scoops : 10; // set a hardlimit at 10 if no SCOOP_SIZE is provided.
  const words: object[] = [];
  Words.getApprovedWords()
    .then((possibleWords) => {
      const m = Math.min(nw, possibleWords.length, hardLimit);
      let chosen: number[] = range(m);
      for (let i = 0; i < m; i++) {
        const choice = chosen[Math.floor(Math.random() * chosen.length)];
        words.push(possibleWords[choice]);
        chosen = chosen.filter((num) => num !== choice); // reduce the lot
      }
      res.status(200).json({ words });
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
 * GET /:id
 * update a word, by ID
 */
router.get("/id/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Words.getById(id)
    .then((word) => {
      res.status(200).json({ word });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * PUT /id/:id/approve
 * Approve a word, by ID
 */
router.put("/id/:id/approve", (req, res) => {
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
 * put /id/:id/reject
 * Reject a word, by ID
 */
router.put("/id/:id/reject", (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  Words.getById(id).then((wordObj) => {
    wordObj = {
      ...wordObj,
      moderated: true,
      approved: false
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
