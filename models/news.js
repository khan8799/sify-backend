const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is missing."],
    },
    newsId: { type: String, default: null },
    author: { type: String },
    title: { type: String },
    description: { type: String, default: null },
    content: { type: String, default: null },
    source: { type: mongoose.Schema.Types.Mixed, default: null },
    publishedAt: { type: String, default: null },
    url: { type: String, default: null },
    urlToImage: { type: String, default: null },
    isBookmark: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("news", Schema);
