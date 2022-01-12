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
exports.update = exports.add = void 0;
const dbConfig_1 = __importDefault(require("../../dbConfig"));
const uuid_1 = require("uuid");
function add(member_id, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuId = (0, uuid_1.v4)(); // payment_id
        let payment_id;
        try {
            // create a record for this payment, prior to processing
            payment_id = yield (0, dbConfig_1.default)("Payment")
                .insert({
                id: uuId,
                amount,
                member_id,
                external: "processing"
            })
                .returning("id");
        }
        catch (err) {
            // NOTE: it should error when the member_id does not exist
            return { ok: false, message: "error" };
        }
        return { ok: true, payment_id };
    });
}
exports.add = add;
function update(payment_id, external) {
    return __awaiter(this, void 0, void 0, function* () {
        // update the payment with external payment provider detail
        try {
            yield (0, dbConfig_1.default)("Payment").update({ external }).where({ id: payment_id });
        }
        catch (err) {
            return { ok: false, message: err.message };
        }
        return { ok: true, message: "success" };
    });
}
exports.update = update;
//# sourceMappingURL=model.js.map