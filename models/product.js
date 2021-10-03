const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        default: "default_image_url",
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