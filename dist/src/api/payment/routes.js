"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const bodyParser = __importStar(require("body-parser"));
const StripePayments_1 = require("./StripePayments");
const model_1 = require("./model");
const router = express_1.Router();
const membership = {
    month: 500,
    week: 125,
    year: 6000
};
const discounted = {
    month: membership.month,
    week: membership.week,
    year: membership.year - 2 * membership.week
};
/**
 * returns the price of this item
 * @param item key
 */
function getPrice(item) {
    // using the lowest common denom for app-local currency USD:cents
    return discounted[item] || -1;
}
/**
 * prices are calculated server-side and a "payment intent" is returned.
 */
router.post("/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkout = req.body.cart;
    const member_id = req.body.member_id;
    // process the items and create a payment record.
    let total = 0;
    let errors = [];
    let payment_id;
    checkout.items.forEach((item) => {
        const price = getPrice(item);
        if (price < 0) {
            errors.push({ error: `${item} not found` });
        }
        else {
            total += price;
        }
    });
    if (errors.length > 0) {
        res.status(400).json({ errors });
    }
    const result = yield model_1.add(member_id, total);
    if (!result.ok) {
        res.status(400).json({ error: result.message });
    }
    // payment record id indicates a valid member & a valid item.
    payment_id = result.payment_id || "";
    if (payment_id.length === 0) {
        res.status(400).json({ error: "error while adding record" });
    }
    const intent = yield createPaymentIntent(payment_id, total);
    if (intent.error) {
        res.status(400).json({ error: intent.error });
    }
    res.status(201).json({ intent });
}));
function createPaymentIntent(payment_id, total) {
    return __awaiter(this, void 0, void 0, function* () {
        let paymentIntent;
        let updatedPayment;
        let clientSecret;
        const currency = "USD";
        const params = {
            amount: total,
            currency
        };
        try {
            paymentIntent = yield StripePayments_1.stripe.paymentIntents.create(params);
            clientSecret = paymentIntent.client_secret || "";
            updatedPayment = yield model_1.update(payment_id, clientSecret);
        }
        catch (err) {
            return { error: err.message };
        }
        if (!updatedPayment.ok) {
            console.log(updatedPayment.message);
            return { error: updatedPayment.message };
        }
        return {
            clientSecret: paymentIntent.client_secret,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        };
    });
}
// Expose endpoint as webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard:
// https://dashboard.stripe.com/test/webhooks
// using body-parser to retrieve the raw body as a buffer.
router.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripeBody = req.body;
    const stripeHeaders = req.headers["stripe-signature"] || "";
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    try {
        event = StripePayments_1.stripe.webhooks.constructEvent(stripeBody, stripeHeaders, stripeSecret);
    }
    catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        res.sendStatus(400);
        return;
    }
    // Extract the data from the event.
    const data = event.data;
    const eventType = event.type;
    if (eventType === "payment_intent.succeeded") {
        // Cast the event into a PaymentIntent to make use of the types.
        const pi = data.object;
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
        console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
        console.log("💰 Payment captured!");
    }
    else if (eventType === "payment_intent.payment_failed") {
        // Cast the event into a PaymentIntent to make use of the types.
        const pi = data.object;
        console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
        console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
}));
exports.default = router;
//# sourceMappingURL=routes.js.map