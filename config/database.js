const mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.MONGO_DB;

mongoose
  .connect(URI)
  .then((res) => {
    console.log("Connection established with database");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
