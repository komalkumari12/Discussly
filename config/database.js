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

// const mongoose = require("mongoose");
// require("dotenv").config();

// const URI = process.env.MONGO_DB;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
