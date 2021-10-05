const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "Uploads\\images\\default.jpg",
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
    },
    description: {
        type: String,
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model("product", productSchema);