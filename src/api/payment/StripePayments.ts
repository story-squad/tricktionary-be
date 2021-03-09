import Stripe from "stripe";

function getSecret() {
  return process.env.STRIPE_SECRET_KEY || "UNDEFINED";
}

const stripe = new Stripe(getSecret(), {
  apiVersion: "2020-08-27",
  typescript: true
});

export { stripe }
