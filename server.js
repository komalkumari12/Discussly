const express = require("express");
const app = express();
require("dotenv").config();
require("./config/database");

const userRouter = require("./routers/userRoutes");
const discussionRouter = require("./routers/discussionRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/discussions", authMiddleware, discussionRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
