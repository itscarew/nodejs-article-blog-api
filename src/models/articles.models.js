const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  articleImage: { type: String },
  user: { type: String, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Likes" }],
  likeCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Article", ArticleSchema);
