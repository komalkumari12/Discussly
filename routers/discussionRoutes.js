const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/createDiscussion",
  authMiddleware,
  discussionController.createDiscussion
);
router.put("/updateDiscussion/:id", discussionController.updateDiscussion);
router.delete("/deleteDiscussion/:id", discussionController.deleteDiscussion);
router.get("/getDiscussions", discussionController.getDiscussions);
router.get(
  "/getDiscussionsByTag/:tag",
  discussionController.getDiscussionsByTag
);
router.get("/getDiscussionsByText", discussionController.getDiscussionsByText);

module.exports = router;
