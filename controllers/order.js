const db = require("../utils/db");
const stripe = require("stripe")(process.env.STRIPE_URI);

async function getOrders(req, res) {
  res.json("Haalo");
}

async function placeOrders(req, res) {
  res.json(req.params.id);
}
<<<<<<< HEAD

async function checkout(req, res) {
  try {
    let lineItems = req.body.line_items;
    let metaData = req.body.metaData;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: process.env.STRIPE_RETURN_URL,
      cancel_url: process.env.STRIPE_REJECT_URL,
      metadata: metaData,
    });
    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.log("error----->", error.message);
    res.status(500).json(error);
  }
}

=======
// TODO: DELETE ORDER...
>>>>>>> c3905be4b1136946380eefdabb6070beaa6ffc06
module.exports = {
  getOrders,
  placeOrders,
  checkout,
};
