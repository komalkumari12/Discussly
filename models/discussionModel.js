const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
  hashtags: [{ type: String }],
  createdOn: { type: Date, default: Date.now },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Discussion", discussionSchema);
