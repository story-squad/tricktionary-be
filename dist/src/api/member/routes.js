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
const router = express_1.Router();
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, fullname, location, external } = req.body;
    let createMember;
    let member_id = "ERROR CREATING MEMBERSHIP";
    try {
        createMember = yield model_1.default.add(email, username, fullname, location, external);
        // member_id = createMember.member_id;
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
    res.status(200).json({ member_id: (createMember === null || createMember === void 0 ? void 0 : createMember.member_id) || member_id });
}));
// todo: findby email, findby member_id
// todo: integrate OktaProfile
exports.default = router;
//# sourceMappingURL=routes.js.map