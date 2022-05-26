const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const env = process.env.BUILD_ENV || "dev";
const envPath = ".env." + env;
console.log(envPath);
dotenv.config({
  path: envPath,
});

const cors = require("cors");

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
const paymentRoutes = require("./routes/payment");

app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);

app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;

