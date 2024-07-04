const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.post("/createUser", userController.createUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/getUsers", userController.getUsers);
router.get("/searchUserByName", userController.searchUserByName);

router.post("/follow/:userId", authMiddleware, userController.followUser);
router.delete("/unfollow/:userId", authMiddleware, userController.unfollowUser);

module.exports = router;
