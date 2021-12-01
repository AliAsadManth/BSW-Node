const mongoose = require("mongoose");

const taxSchema = mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    delivery: {
        type: Number,
        required: true
    },
},{ timestamps: true });

module.exports = mongoose.model("tax", taxSchema);
