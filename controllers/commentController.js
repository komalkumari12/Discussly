const Comment = require("../models/commentModel");
const Discussion = require("../models/discussionModel");
const User = require("../models/userModel");

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

    await Comment.findByIdAndDelete(id);

    const discussion = await Discussion.findById(comment.discussion);
    discussion.comments.pull(comment._id);
    await discussion.save();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
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

// exports.replyToComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { text } = req.body;
//     const userId = req.user.id;

//     const newReply = new Comment({
//       text,
//       postedBy: userId,
//       createdOn: new Date(),
//       parentComment: id,
//       discussion: req.body.discussionId,
//     });

//     const savedReply = await newReply.save();

//     await Comment.findByIdAndUpdate(commentId, {
//       $push: { replies: savedReply._id },
//     });

//     return res.status(201).json({
//       message: "Reply added successfully",
//       reply: savedReply,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: error.message,
//     });
//   }
// };
