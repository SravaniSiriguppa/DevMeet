const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

app.get("/", (req, res) => {
  res.send("Welcome to NamasteDev Backend 🚀 ");
});

module.exports = app;