const mongoose = require("mongoose");

const sliderSchema = mongoose.Schema({
    active: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model("slider", sliderSchema);