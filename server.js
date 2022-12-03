const express = require("express");
const app = express();
const cors = require("cors");
let ConfigureLibrary = require("dotenv").config({ path: __dirname + "/.env" });

app.use(cors());

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 1000,
      payment_method_types: ["card"],
      description: "my_cart app payment by customer",
    });
    console.log(paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
