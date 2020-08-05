const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./src/routes/user.routes");
const articlesRoute = require("./src/routes/articles.routes");
const commentsRoutes = require("./src/routes/comments.routes");

//connect to the the Database
mongoose.connect(`mongodb://localhost:27017/newwave`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();

//use cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/articles", articlesRoute);
app.use("/comments", commentsRoutes);
app.use("/uploads", express.static("uploads"));

//err message that passes when a route that does not exist is passed!!
app.use((req, res, next) => {
  const error = new Error("You entered a route that does not exist !!");
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 400);
  res.json({
    err: error.message,
  });
});

module.exports = app;
