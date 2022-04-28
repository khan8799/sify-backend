const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is missing."],
    },
    orderId: { type: String, unique: true, required: [true, "Amount is missing."] },
    entity: { type: String },
    amount: { type: Number, required: [true, "Amount is missing."] },
    amountPaid: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    currency: { type: String, default: null },
    receipt: { type: String, default: null },
    offerId: { type: String, default: null },
    status: { type: String, default: null },
    attempts: { type: Number, default: null },
    notes: { type: Array, default: null },
    createdAtTimestamp: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", Schema);
