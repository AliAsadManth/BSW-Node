const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
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
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
