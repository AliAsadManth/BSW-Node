const db = require("../utils/db");
const Order = db.Order;
const Cart = db.Cart;
const stripe = require("stripe")(process.env.STRIPE_URI);

async function getOrders(req, res) {
  try {
    let orders = await Order.find().populate({
      path: "cartId",
      populate: {
        path: "product.productId",
        model: "product"
      }
    }).sort({status: 1}).populate("userId");
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getOrderById(req, res) {
  try {
    let orders = await Order.find({userId: req.params.id}).populate({
      path: "cartId",
      populate: {
        path: "product.productId",
        model: "product"
      }
    }).sort({status: 1});
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function placeOrders(req, res) {
  try {
    let order = Order(req.body);
    order.userId = req.params.id;
    await Order.create(order).then(async ()=>{
      let cart = await Cart.findById(order.cartId);
      cart.status = true;
      cart.orderId = order._id;
      await Cart.findByIdAndUpdate(order.cartId, cart).then(()=>{
        res.json({msg: "Order placed sucessfully", orderId : order._id});
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function deleteOrder(req, res){
  try{
    // TODO: DELETE ORDER ...
    res.json(req.params.oid);
  } catch (err) {
    res.status(500).json(err);
  }
}
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

module.exports = {
  getOrders,
  placeOrders,
  checkout,
  getOrderById,
  deleteOrder
};
