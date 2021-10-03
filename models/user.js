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
        default: "user",
    },
    phone_no: {
        type: String,
    }
},{ timestamps: true });

module.exports = mongoose.model("user", userSchema);