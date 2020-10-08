const express = require("express");
const connectDB = require("./config/mongodb");
const cors = require("cors");

//Create server
const app = express();

//Connect to mongo db
connectDB();

//Enable cors
app.use(cors());

//Enable express.json. (this is equivalent to bodyParser)
app.use(express.json({ extended: true }));

//App port
const PORT = process.env.PORT || 4000;

//Import routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

//Execute app
app.listen(PORT, () => {
  console.log(`The server run at port: ${PORT}`);
});
