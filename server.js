const express = require("express");
const app = express();
require("dotenv").config();
require("./config/database");

const userRoutes = require("./routers/userRoutes");
const discussionRoutes = require("./routers/discussionRoutes");
const commentRoutes = require("./routers/commentRoutes");

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/comments", commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
