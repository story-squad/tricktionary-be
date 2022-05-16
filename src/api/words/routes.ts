import { Router } from "express";
import Words from "./model";
import { validateWord, validNumber } from "./utils";
import {log} from "../../logger";
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
          log(`${result.value}, ${err.message}`);
        });
      added++;
    } else {
      log(result.message);
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
    log(`duplicate: ${duplicate.word}`);
    if (!duplicate) {
      // add to database
      Words.add(result.value)
        .then(([id]) => {
          // return id of new record
          res.status(201).json({ id });
        })
        .catch((err) => {
          // error adding to database
          log("ERROR: /contribute");
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
router.get("/scoop/:count", async (req, res) => {
  const numberOfWords: any = req.params.count;
  const nw = validNumber(numberOfWords) ? Number(numberOfWords) : 1;
  const scoops = validNumber(process.env.SCOOP_SIZE)
    ? Number(process.env.SCOOP_SIZE)
    : 0;
  const words: object[] = [];
  const idObjs: any[] = await Words.getApprovedWordIds();
  let ids: number[] = idObjs.map(({ id }) => id); // array of numbers
  const hardLimit = scoops > 0 ? scoops : 10; // set a hardlimit at 10 if no SCOOP_SIZE is provided.
  const m = Math.min(nw, ids.length, hardLimit);
  for (let i = 0; i < m; i++) {
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    const randomWord = await Words.getById(randomId);
    words.push(randomWord);
    ids = ids.filter((num) => num !== randomId); // reduce the lot
  }
  res.status(200).json({ words });
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

/**
 * put /id/:id
 * modify a word, by ID
 */
router.put("/id/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) res.status(400).json({ error: "id?" });
  const result = validateWord(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.message });
  }
  const oldRecord:any = await Words.getById(id);
  // if the spelling has changed, the db will consider this a different word.
  if (result.value.word.toLowerCase() !== oldRecord.word.toLowerCase()) {
    // make sure this word doesn't already exist under another id.
    const dup: any = await Words.getByName(result.value.word);
    if (dup?.id) {
      // because if it does, we can't PUT it here.
      return res.status(409).json({ error: `that word was already defined at id:${dup.id}`});
    }
  }
  // at this point, we should be ok to update the database.
  try {
    const word:any = await Words.update(id, {
      ...oldRecord,
      ...result.value,
    });
    res.status(200).json({ word });
  } catch(err:any) {
    res.status(500).json({ error: err.message})
  }
});

export default router;
