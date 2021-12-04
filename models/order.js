const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    status: {
      //? 0 -> pending, 1-> processing, 2-> on its way, 3-> Delivered,
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    totalPrice: {
      //? price of products bought
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: false,
    },
    tax: {
      type: Number,
      required: true,
    },
    deliveryCharges: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
