const db = require("../utils/db");
const Cart = db.Cart;

async function addToCart(req, res) {
  let chk = false;
  let index = -1;
  try {
    if (parseInt(req.body.quatity) === 0) {
      res.json({ status: 201, msg: "Quantity cannot be 0!" });
      return;
    }

    let cartChk = await Cart.countDocuments({
      userId: req.params.uid,
      status: false,
    });
    if (cartChk !== 0) {
      let cart = await Cart.findOne({ userId: req.params.uid, status: false });

      cart.product.forEach((singleProduct, i) => {
        if (singleProduct.productId == req.body.productId) {
          chk = true; //? Product Find
          index = i; //? Index no
        }
      });
      if (chk) {
        cart.product[index].quatity += parseInt(req.body.quatity);
        let data = await Cart.findByIdAndUpdate(cart._id, cart).populate(
          "product.productId"
        );
        res.status(200).json({ msg: "Product Added to Cart.", data });
      } else {
        cart.product.push(req.body);
        let data = await Cart.findByIdAndUpdate(cart._id, cart).populate(
          "product.productId"
        );
        res.status(200).json({ msg: "Product Added to Cart.", data });
      }
    } else {
      let cart = Cart({ userId: req.params.uid });
      cart.product.push(req.body);
      let data = await Cart.create(cart);
      data = await data.populate("product.productId");
      res.status(200).json({ msg: "Product Added to Cart.", data });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
}

async function increment(req, res) {
  let index = -1;
  try {
    let cart = await Cart.findOne({ userId: req.params.uid });
    cart.product.forEach((singleProduct, i) => {
      if (singleProduct.productId == req.params.id) {
        index = i; //? Index no
      }
    });
    cart.product[index].quatity += 1;
    await Cart.findByIdAndUpdate(cart._id, cart).then(() => {
      res.status(200).json({ msg: "Quantity increased" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function decrement(req, res) {
  let index = -1;
  try {
    let cart = await Cart.findOne({ userId: req.params.uid });
    cart.product.forEach((singleProduct, i) => {
      if (singleProduct.productId == req.params.id) {
        index = i; //? Index no
      }
    });
    cart.product[index].quatity -= 1;
    if (cart.product[index].quatity === 0) {
      cart.product.splice(index, 1);
    }
    await Cart.findByIdAndUpdate(cart._id, cart).then(() => {
      res.status(200).json({ msg: "Quantity decreased" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getCart(req, res) {
  try {
    let goodsTotal = 0;
    let tax = 0;
    let delivery = 0;
    let grandTotal = 0;
    let cart = await Cart.findOne({
      userId: req.params.uid,
      status: false,
    }).populate("product.productId");
    cart.product.forEach((doc, index) => {
      let price = doc.productId.price * doc.quatity;
      goodsTotal += price;
    });
    let taxInfo = await db.Tax.findOne();
    delivery = taxInfo.delivery;
    if (goodsTotal >= 100) {
      tax = parseFloat((goodsTotal / taxInfo.tax).toFixed(2));
      delivery = 0;
    } else if (goodsTotal === 0) {
      tax = 0;
      delivery = 0;
    } else {
      tax = parseFloat(((goodsTotal + delivery) / taxInfo.tax).toFixed(2));
    }
    grandTotal = parseFloat((goodsTotal + delivery + tax).toFixed(2));
    let calc = {
      goodsTotal: goodsTotal,
      tax: tax,
      delivery: delivery,
      grandTotal: grandTotal,
    };
    cart = { cart: cart, calc: calc };
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function removeFromCart(req, res) {
  let index = -1;
  try {
    let cart = await Cart.findOne({ userId: req.params.uid });
    cart.product.forEach((singleProduct, i) => {
      if (singleProduct.productId == req.params.id) {
        index = i; //? Index no
      }
    });
    if (index >= 0) {
      cart.product.splice(index, 1);
    }
    await Cart.findByIdAndUpdate(cart._id, cart).then(() => {
      res.status(200).json({ msg: "Product Deleted from Cart." });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  addToCart,
  getCart,
  increment,
  decrement,
  removeFromCart,
};
