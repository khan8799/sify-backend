const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is missing."],
    },
    bookingDate: { type: String, default: null },
    location: { type: String },
    email: { type: String },
    tests: { type: Array, default: [] },
    instructions: { type: String, default: null },
    timeSlot: { type: mongoose.Schema.Types.Mixed, default: null },
    slip: { type: String, default: null },
    galleryFile: { type: String, default: null },
    urlToImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointment", Schema);
