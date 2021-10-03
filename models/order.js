const  mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
    },
    deliveryCharges: {
        type: Number,
    },
    grandTotal: {
        type: Number,
    }
},{ timestamps: true });

module.exports = mongoose.model("order", orderSchema);