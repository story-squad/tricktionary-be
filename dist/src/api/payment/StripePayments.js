"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
function getSecret() {
    return process.env.STRIPE_SECRET_KEY || "UNDEFINED";
}
const stripe = new stripe_1.default(getSecret(), {
    apiVersion: "2020-08-27",
    typescript: true
});
exports.stripe = stripe;
//# sourceMappingURL=StripePayments.js.map