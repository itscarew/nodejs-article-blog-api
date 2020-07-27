const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.routes");
const articlesRoute = require("./routes/articles.routes");
const commentsRoutes = require("./routes/comments.routes");

//connect to the the Database
mongoose.connect(`mongodb://localhost:27017/newwave`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/articles", articlesRoute);
app.use("/comments", commentsRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is working fine at ${PORT}`);
});

module.exports = app;
