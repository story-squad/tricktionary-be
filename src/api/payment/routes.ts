import { Router } from "express";
import * as bodyParser from "body-parser";

import { stripe } from "./StripePayments";
import { add, update } from "./model";
import Stripe from "stripe";
import { log } from "../../logger";

const router = Router();

interface ShoppingCart {
  items: string[];
}

type priceList = {
  [key: string]: number;
};

const membership: priceList = {
  month: 500,
  week: 125,
  year: 6000,
};

const discounted: priceList = {
  month: membership.month,
  week: membership.week,
  year: membership.year - 2 * membership.week,
};

/**
 * returns the price of this item
 * @param item key
 */
function getPrice(item: string): number {
  // using the lowest common denom for app-local currency USD:cents
  return discounted[item] || -1;
}

/**
 * prices are calculated server-side and a "payment intent" is returned.
 */
router.post("/checkout", async (req, res) => {
  const checkout: ShoppingCart = req.body.cart;
  const member_id: string = req.body.member_id;
  // process the items and create a payment record.
  let total: number = 0;
  let errors: object[] = [];
  let payment_id: string;
  checkout.items.forEach((item: string) => {
    const price = getPrice(item);
    if (price < 0) {
      errors.push({ error: `${item} not found` });
    } else {
      total += price;
    }
  });
  if (errors.length > 0) {
    res.status(400).json({ errors });
  }
  const result = await add(member_id, total);
  if (!result.ok) {
    res.status(400).json({ error: result.message });
  }
  // payment record id indicates a valid member & a valid item.
  payment_id = result.payment_id ? result.payment_id[0] : "";
  if (payment_id.length === 0) {
    res.status(400).json({ error: "error while adding record" });
  }
  const intent = await createPaymentIntent(payment_id, total);
  if (intent.error) {
    res.status(400).json({ error: intent.error });
  }
  res.status(201).json({ intent });
});

async function createPaymentIntent(payment_id: string, total: number) {
  let paymentIntent: Stripe.PaymentIntent;
  let updatedPayment;
  let clientSecret: string;
  const currency = "USD";
  const params: Stripe.PaymentIntentCreateParams = {
    amount: total,
    currency,
  };
  try {
    paymentIntent = await stripe.paymentIntents.create(params);
    clientSecret = paymentIntent.client_secret || "";
    updatedPayment = await update(payment_id, clientSecret);
  } catch (err) {
    return { error: err.message };
  }
  if (!updatedPayment.ok) {
    log(updatedPayment.message);
    return { error: updatedPayment.message };
  }
  return {
    clientSecret: paymentIntent.client_secret,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  };
}

// Expose endpoint as webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard:
// https://dashboard.stripe.com/test/webhooks
// using body-parser to retrieve the raw body as a buffer.
router.post(
  "/webhook",
  // bodyParser.raw({ type: "application/json" }),
  async (req, res): Promise<void> => {
    const stripeBody = req.body;
    // todo: fix 'Webhook signature verification failed'
    const stripeHeaders = req.headers["stripe-signature"] || "";
    const stripeSecret: string = process.env.STRIPE_WEBHOOK_SECRET || "";
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        stripeBody,
        stripeHeaders,
        stripeSecret
      );
    } catch (err) {
      log(`⚠️  Webhook signature verification failed.`);
      res.sendStatus(400);
      return;
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    if (eventType === "payment_intent.succeeded") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
      log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      log("❌ Payment failed.");
    }
    res.sendStatus(200);
  }
);
export default router;
