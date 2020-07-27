const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema({
  article: { type: String, ref: "Article", required: true },
  user: { type: String, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Likes", LikesSchema);
