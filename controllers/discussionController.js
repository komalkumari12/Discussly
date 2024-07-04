const Discussion = require("../models/discussionModel");

exports.createDiscussion = async (req, res) => {
  try {
    const { text, image, hashtags } = req.body;
    const userId = req.user.id;

    const newDiscussion = new Discussion({
      text,
      image,
      hashtags,
      createdOn: new Date(),
      postedBy: userId,
    });

    const savedDiscussion = await newDiscussion.save();
    return res.status(201).json({
      message: "Discussion created successfully",
      discussion: savedDiscussion,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    return res.status(201).json({
      message: "Discussion updated successfully",
      discussion: discussion,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findByIdAndDelete(id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    return res.status(200).json({
      message: "Discussion deleted successfully",
      discussion: discussion,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({});

    if (discussions.length === 0) {
      return res.status(404).json({});
    }

    return res.status(200).json({
      message: "Discussions fetched successfully",
      discussions: discussions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDiscussionsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const discussions = await Discussion.find({ hashtags: tag });

    return res.status(200).json({
      message: discussions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDiscussionsByText = async (req, res) => {
  try {
    const { text } = req.query;
    const discussions = await Discussion.find({ text: new RegExp(text, "i") });

    return res.status(200).json({
      message: discussions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
