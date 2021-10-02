const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    time : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("subCategory", subCategorySchema);