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
const oktaRequired_1 = __importDefault(require("../middleware/oktaRequired"));
const oktaProfileModel_1 = __importDefault(require("./oktaProfileModel"));
const router = express_1.Router();
router.get('/', oktaRequired_1.default, function (req, res) {
    oktaProfileModel_1.default.findAll()
        .then((profiles) => {
        res.status(200).json(profiles);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
    });
});
router.get('/:id', oktaRequired_1.default, function (req, res) {
    const id = String(req.params.id);
    oktaProfileModel_1.default.findById(id)
        .then((profile) => {
        if (profile) {
            res.status(200).json(profile);
        }
        else {
            res.status(404).json({ error: 'ProfileNotFound' });
        }
    })
        .catch((err) => {
        res.status(500).json({ error: err.message });
    });
});
router.post('/', oktaRequired_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = req.body;
    if (profile) {
        const id = profile.id || 0;
        try {
            yield oktaProfileModel_1.default.findById(id).then((pf) => __awaiter(void 0, void 0, void 0, function* () {
                if (pf == undefined) {
                    //profile not found so lets insert it
                    yield oktaProfileModel_1.default.create(profile).then((profile) => res
                        .status(200)
                        .json({ message: 'profile created', profile: profile[0] }));
                }
                else {
                    res.status(400).json({ message: 'profile already exists' });
                }
            }));
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    }
    else {
        res.status(404).json({ message: 'Profile missing' });
    }
}));
router.put('/', oktaRequired_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = req.body;
    if (profile) {
        const id = profile.id || 0;
        try {
            yield oktaProfileModel_1.default.findById(id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                const updated = yield oktaProfileModel_1.default.update(id, profile);
                res.status(200).json({ message: 'profile updated', profile: updated[0] });
            }));
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    }
    else {
        res.status(404).json({ message: 'Profile missing' });
    }
}));
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    try {
        oktaProfileModel_1.default.findById(id).then((profile) => {
            oktaProfileModel_1.default.remove(profile.id).then(() => {
                res
                    .status(200)
                    .json({ message: `Profile '${id}' was deleted.`, profile: profile });
            });
        });
    }
    catch (err) {
        res.status(500).json({
            message: `Could not delete profile with ID: ${id}`,
            error: err.message,
        });
    }
});
module.exports = router;
//# sourceMappingURL=oktaProfileRouter.js.map