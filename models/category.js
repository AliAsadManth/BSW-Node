const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: String,
        enum: ["10001", "10002", "10003", "10004"],
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model("category", categorySchema);