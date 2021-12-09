const db = require("../utils/db");
const Order = db.Order;
const Cart = db.Cart;
const Product = db.Product;
const stripe = require("stripe")(process.env.STRIPE_URI);

async function getOrders(req, res) {
  try {
    let orders = await Order.find()
      .populate({
        path: "cartId",
        populate: {
          path: "product.productId",
          model: "product",
        },
      })
      .sort({ _id: -1 })
      .populate("userId");
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getOrderById(req, res) {
  try {
    let orders = await Order.find({ userId: req.params.id })
      .populate({
        path: "cartId",
        populate: {
          path: "product.productId",
          model: "product",
        },
      })
      .sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function placeOrders(req, res) {
  try {
    let order = Order(req.body);
    let prev_order = await Order.findOne().sort({ _id: -1 });
    order.userId = req.params.id;

    // .limit(1);
    if(!prev_order){
      order.invoiceNo = 1;
      res.json("if");
    }
     else{
      order.invoiceNo = prev_order.invoiceNo + 1;
      // res.json("else");
    }
    
    // order.invoiceNo
    await Order.create(order).then(async () => {
      let cart = await Cart.findById(order.cartId);
      cart.status = true;
      cart.orderId = order._id;
      cart.product.forEach(async (product) => {
        let productId = product.productId;
        let quantity = product.quatity;
        let db_product = await Product.findById(productId);
        db_product.stock -= quantity;
        await Product.findByIdAndUpdate(db_product._id, db_product);
      });
      await Cart.findByIdAndUpdate(order.cartId, cart).then(() => {
        res.json({ msg: "Order placed sucessfully", orderId: order._id });
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function deleteOrder(req, res) {
  try {
    let order = await Order.findById(req.params.oid);
    let cartId = order.cartId;
    await Order.findByIdAndDelete(order._id).then(async ()=>{
      await Cart.findByIdAndDelete(cartId).then(()=>{
        res.json({msg: "Order Deleted Sucessfully"});
      });
    });
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
  deleteOrder,
};
