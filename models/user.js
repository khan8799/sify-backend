const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    displayName: { type: String, default: null},
    contact: { type: String, default: null},
    email: { type: String, unique: true, required: [true, "Email cannot be empty."] },
    password: { type: String, required: [true, "Password cannot be empty."] },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", Schema);
