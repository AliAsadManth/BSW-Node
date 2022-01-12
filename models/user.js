const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      //? User Email verified => true
      type: Boolean,
      default: false,
    },
    otp: {
      //? change password otp
      type: String,
      require: true,
    },
    role: {
      //? Admin or user
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },
    phone_no: {
      type: String,
      require: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
