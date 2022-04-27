const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const envPath = ".env.dev";
dotenv.config({
  path: envPath,
});

const cors = require("cors");

// const db = 'mongodb+srv://twerlo:twerlo@cluster0.q6slj.mongodb.net/sify?retryWrites=true&w=majority';
const db = process.env.MONGOHOST;
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(db)

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "40mb" }));

const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/news");
const appointmentRoutes = require("./routes/appointment");

app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/appointment", appointmentRoutes);

app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

module.exports = app;

