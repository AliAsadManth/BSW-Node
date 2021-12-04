const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    product: [ //? products in cart 
       {
           productId:{type:mongoose.Schema.Types.ObjectId, ref:"product"},
           quatity:Number,
       }
    ],
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status: { //? False => Still in cart, True => Ordered Products
        type: Boolean,
        default: false,
    }
},{ timestamps: true });

module.exports = mongoose.model("cart", cartSchema);