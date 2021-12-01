const  mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    },
    totalPrice: { //? price of products bought
        type: Number,
        required: true,
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
    }
},{ timestamps: true });

module.exports = mongoose.model("order", orderSchema);