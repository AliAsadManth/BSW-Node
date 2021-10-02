const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required:true,
        trim:true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    phone_no: {
        type: String,
    },
    time : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);