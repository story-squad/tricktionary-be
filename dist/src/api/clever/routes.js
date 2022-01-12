"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cleverRequired_1 = require("../middleware/cleverRequired");
const router = (0, express_1.Router)();
router.get("/", cleverRequired_1.cleverStudentRequired, (req, res) => {
    res.status(200).json({ ok: true, message: "Clever student verified." });
});
exports.default = router;
//# sourceMappingURL=routes.js.map