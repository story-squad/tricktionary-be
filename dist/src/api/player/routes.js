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
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const express_1 = require("express");
const router = express_1.Router();
router.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    let player;
    try {
        player = yield model_1.getPlayer(player_id);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json({ player });
}));
router.get("/last-user-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.id;
    let player;
    try {
        player = yield model_1.findPlayer("last_user_id", user_id);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json({ player });
}));
router.put("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    const changes = req.body;
    let player;
    try {
        player = yield model_1.updatePlayer(player_id, changes);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
    res.status(200).json({ player });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map