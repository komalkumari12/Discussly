const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const { isAuth } = require("../middlewares/jwt");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.post("/createUser", userController.createUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/getUsers", userController.getUsers);
router.get("/searchUserByName", userController.searchUserByName);

module.exports = router;
