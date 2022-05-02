const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is missing."],
    },
    reference: { type: String, default: null },
    bookingDate: { type: String, default: null },
    address: { type: String, default: null },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    tests: { type: Array, default: [] },
    instructions: { type: String, default: null },
    timeSlot: { type: mongoose.Schema.Types.Mixed, default: null },
    slips: { type: String, default: null },
    isPickUp: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointment", Schema);
