const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model("subCategory", subCategorySchema);