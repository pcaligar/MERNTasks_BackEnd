const mongoose = require("mongoose");
require("dotenv").config({ path: "./src/variables.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1); //Stop app
  }
};

module.exports = connectDB;
