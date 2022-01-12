"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const model_1 = __importDefault(require("./model"));
const utils_1 = require("./utils");
const logger_1 = require("../../logger");
const router = (0, express_1.Router)();
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
    let added = 0;
    let skipped = 0;
    // begin for-loop
    words.forEach((pair) => {
        const [[word, definition]] = Object.entries(pair);
        const result = (0, utils_1.validateWord)({ word, definition });
        if (result.ok) {
            model_1.default.add(result.value)
                .then(() => true)
                .catch((err) => {
                (0, logger_1.log)(`${result.value}, ${err.message}`);
            });
            added++;
        }
        else {
            (0, logger_1.log)(result.message);
            skipped++;
        }
    }); // end for-loop
    res.status(201).json({ added, skipped });
});
router.post("/contribute", (req, res) => {
    const result = (0, utils_1.validateWord)(req.body);
    let duplicate;
    if (!result.ok) {
        return res.status(400).json({ error: result.message });
    }
    model_1.default.getByName(result.value.word).then((dup) => {
        duplicate = (dup === null || dup === void 0 ? void 0 : dup.id) ? dup : false;
        (0, logger_1.log)(`duplicate: ${duplicate.word}`);
        if (!duplicate) {
            // add to database
            model_1.default.add(result.value)
                .then(([id]) => {
                // return id of new record
                res.status(201).json({ id });
            })
                .catch((err) => {
                // error adding to database
                (0, logger_1.log)("ERROR: /contribute");
                res.status(400).json({ error: err });
            });
        }
        else {
            // return id of existing record
            res.status(200).json({ id: dup.id });
        }
    });
});
/**
 * GET / returns a random approved word
 */
router.get("/", (req, res) => {
    model_1.default.getApprovedWords()
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
    model_1.default.getByName(word).then((value) => res.status(200).json(value));
});
/**
 * GET / returns a scoop of n-many random approved word
 */
router.get("/scoop/:count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numberOfWords = req.params.count;
    const nw = (0, utils_1.validNumber)(numberOfWords) ? Number(numberOfWords) : 1;
    const scoops = (0, utils_1.validNumber)(process.env.SCOOP_SIZE)
        ? Number(process.env.SCOOP_SIZE)
        : 0;
    const words = [];
    const idObjs = yield model_1.default.getApprovedWordIds();
    let ids = idObjs.map(({ id }) => id); // array of numbers
    const hardLimit = scoops > 0 ? scoops : 10; // set a hardlimit at 10 if no SCOOP_SIZE is provided.
    const m = Math.min(nw, ids.length, hardLimit);
    for (let i = 0; i < m; i++) {
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        const randomWord = yield model_1.default.getById(randomId);
        words.push(randomWord);
        ids = ids.filter((num) => num !== randomId); // reduce the lot
    }
    res.status(200).json({ words });
}));
/**
 * GET /unmoderated
 */
router.get("/unmoderated", (req, res) => {
    model_1.default.getUnmoderatedWord()
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
    if (!id)
        res.status(400).json({ error: "id?" });
    model_1.default.getById(id)
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
    if (!id)
        res.status(400).json({ error: "id?" });
    model_1.default.getById(id).then((wordObj) => {
        wordObj = Object.assign(Object.assign({}, wordObj), { moderated: true, approved: true });
        model_1.default.update(id, wordObj)
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
    if (!id)
        res.status(400).json({ error: "id?" });
    model_1.default.getById(id).then((wordObj) => {
        wordObj = Object.assign(Object.assign({}, wordObj), { moderated: true, approved: false });
        model_1.default.update(id, wordObj)
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
router.put("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!id)
        res.status(400).json({ error: "id?" });
    const result = (0, utils_1.validateWord)(req.body);
    if (!result.ok) {
        return res.status(400).json({ error: result.message });
    }
    const oldRecord = yield model_1.default.getById(id);
    // if the spelling has changed, the db will consider this a different word.
    if (result.value.word.toLowerCase() !== oldRecord.word.toLowerCase()) {
        // make sure this word doesn't already exist under another id.
        const dup = yield model_1.default.getByName(result.value.word);
        if (dup === null || dup === void 0 ? void 0 : dup.id) {
            // because if it does, we can't PUT it here.
            return res.status(409).json({ error: `that word was already defined at id:${dup.id}` });
        }
    }
    // at this point, we should be ok to update the database.
    try {
        const word = yield model_1.default.update(id, Object.assign(Object.assign({}, oldRecord), result.value));
        res.status(200).json({ word });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map