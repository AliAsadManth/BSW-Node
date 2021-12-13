const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: [
        { 
            type: String,
            default: ["Uploads\\images\\default.png"],
        }
    ],
    mpn: { //? Manufacturing part number 
        type: String,
        required: true,
    },
    pdf: { //? product pdf file
        type: String,
    },
    stock: { //? availabe stock
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
      required: true,
    },
    featured: { //? show product on main page
      type: Boolean,
      default: false,
    },
    status: { //? product availabe or not
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
