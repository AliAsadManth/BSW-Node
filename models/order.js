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
    },
    time: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("order", orderSchema);