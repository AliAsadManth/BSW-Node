const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    }
},{ timestamps: true });

module.exports = mongoose.model("subCategory", subCategorySchema);