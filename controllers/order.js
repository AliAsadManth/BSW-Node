const db = require("../utils/db");
const Order = db.Order;
const Cart = db.Cart;
const Product = db.Product;
const stripe = require("stripe")(process.env.STRIPE_URI);
const PDFDocument = require("pdfkit");

async function getOrders(req, res) {
  // TODO: Pagination...
  try {
    let page = req.query.page || 1;
    let items_per_page = 20;
    let order_count = await Order.countDocuments();
    let total_pages = Math.ceil(order_count / items_per_page);
    if (page > total_pages) {
      page = total_pages;
    }
    let orders = await Order.find()
      .populate({
        path: "cartId",
        populate: {
          path: "product.productId",
          model: "product",
        },
      })
      .sort({ _id: -1 })
      .populate("userId")
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    res.json({
      orders: orders,
      total_orders: order_count,
      total_pages: total_pages,
      items_per_page: items_per_page,
      current_page: parseInt(page),
      has_next_page: page < total_pages,
      has_previous_page: page > 1,
      next_page: parseInt(page) + 1,
      previous_page: page - 1,
    });
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

    if (!prev_order) {
      order.invoiceNo = 1;
    } else {
      order.invoiceNo = prev_order.invoiceNo + 1;
    }

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
    await Order.findByIdAndDelete(order._id).then(async () => {
      await Cart.findByIdAndDelete(cartId).then(() => {
        res.json({ msg: "Order Deleted Sucessfully" });
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function setStatus(req, res) {
  try {
    let order = await Order.findById(req.params.id);
    let status = parseInt(req.query.status) || parseInt(order.status) + 1;
    if(status > 4){
      status = 4;
    }
    order.status = status;

    await Order.findByIdAndUpdate(req.params.id, order).then(()=>{
      res.json({status: status, msg: "Status updated!"});
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

async function invoice(req, res) {
  let order = await Order.findOne({ _id: req.params.id })
    .populate({
      path: "cartId",
      populate: {
        path: "product.productId",
        model: "product",
      },
    })
    .sort({ _id: -1 })
    .populate("userId");

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment;filename=invoice-number-${order.invoiceNo}.pdf`,
  });
  buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    order
  );
}

function buildPDF(dataCallback, endCallback, data) {
  let doc = new PDFDocument({ margin: 50 });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  //* Creating PDF
  //? Header
  // .image('../uploads/logo.png', 50, 45, { width: 50 })
  //   .fillColor("#444444")
  doc
    .fontSize(30)
    .fill("red", "even-odd")
    .text("BSW-Engineering", 50, 45, { align: "left" })
    .fill("#262729", "even-odd")
    .fontSize(10)
    .text("21 Darlot rd", 200, 45, { align: "right" })
    .text("Landsdale, WA 6065", 200, 65, { align: "right" })
    .moveDown();

  doc.fontSize(25).text("Invoice", 50, 130).moveDown();
  //? Line
  doc.moveTo(50, 165).lineTo(550, 165).fill("#262729", "even-odd");

  //? Customer Info
  let date = new Date(data.createdAt);
  doc
    .fontSize(10)
    .text(`Invoice Number: ${data.invoiceNo}`, 50, 180)
    .text(
      `Invoice Date: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      50,
      195
    )
    .text(`Amount: $${data.grandTotal}`, 50, 210)

    .text(data.name, 300, 180)
    .text(data.email, 300, 195)
    .text(data.address, 300, 210)
    .moveDown();

  //? Line
  doc.moveTo(50, 230).lineTo(550, 230).fill("#262729", "even-odd");

  //? Table Data
  doc
    .fontSize(11)
    .fill("black", "even-odd")
    .text("Item", 50, 300)
    .text("Unit Cost", 300, 300)
    .text("Quantity", 385, 300)
    .text("Total", 470, 300)
    .moveDown();
  //? Line
  doc.moveTo(50, 315).lineTo(550, 315).fill("#262729", "even-odd");

  let position = 325;
  let products = data.cartId.product;
  products.forEach((product) => {
    //? Products Table Data
    doc
      .fontSize(10)
      .text(`${product.productId.name}`, 50, position)
      .text(`$${product.productId.price}`, 300, position)
      .text(`${product.quatity}`, 385, position)
      .text(`$${product.productId.price * product.quatity}`, 470, position)
      .moveDown();
    //? Line
    doc
      .moveTo(50, position + 15)
      .lineTo(550, position + 15)
      .fill("#262729", "even-odd");

    position += 20;
  });

  //? Table Data
  doc
    .fontSize(10)
    .text("SubTotal", 300, position)
    .text(`$${data.goodsTotal}`, 470, position)
    .text("GST", 300, position + 20)
    .text(`$${data.tax}`, 470, position + 20)
    .text("Delivery Charges", 300, position + 40)
    .text(`$${data.deliveryCharges}`, 470, position + 40)
    .text("Grand Total", 300, position + 60)
    .text(`$${data.grandTotal}`, 470, position + 60)
    .moveDown();
  doc.end();
}

async function Webhook(req, res) {
  let sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      "whsec_ye98XrIHsI6XUAfmRTkLKZvdOkFMBduq" //////webhook scret key
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const metaData = session.metadata;
      // Create Order here

      /////////////////////////////
      let order = Order(metaData);
      let prev_order = await Order.findOne().sort({ _id: -1 });

      if (!prev_order) {
        order.invoiceNo = 1;
      } else {
        order.invoiceNo = prev_order.invoiceNo + 1;
      }

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
        await Cart.findByIdAndUpdate(order.cartId, cart);
      });

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

module.exports = {
  getOrders,
  placeOrders,
  setStatus,
  checkout,
  getOrderById,
  deleteOrder,
  invoice,
  Webhook,
};
