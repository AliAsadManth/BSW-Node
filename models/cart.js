const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    product: [
       {
           productId:{type:mongoose.Schema.Types.ObjectId, ref:"product"},
           quatity:Number,
       }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status: {
        type: Boolean,
        default: false,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("cart", cartSchema);