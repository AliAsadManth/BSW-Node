const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parentCategory: {
        type: String,
        required: true,
    },
    time : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("category", categorySchema);