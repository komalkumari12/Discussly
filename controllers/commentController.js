const Comment = require("../models/commentModel");
const Discussion = require("../models/discussionModel");
const User = require("../models/userModel");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { discussionId, text } = req.body;
    const userId = req.user.id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const comment = new Comment({
      text,
      discussion: discussionId,
      user: userId,
    });

    await comment.save();
    discussion.comments.push(comment);
    await discussion.save();

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update an existing comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    comment.text = text;
    await comment.save();

    return res
      .status(200)
      .json({ message: "Comment updated successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.remove();

    const discussion = await Discussion.findById(comment.discussion);
    discussion.comments.pull(comment._id);
    await discussion.save();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already liked this comment" });
    }

    comment.likes.push(userId);
    await comment.save();

    return res
      .status(200)
      .json({ message: "Comment liked successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Dislike a comment
exports.dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have not liked this comment yet" });
    }

    comment.likes.pull(userId);
    await comment.save();

    return res
      .status(200)
      .json({ message: "Comment disliked successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
