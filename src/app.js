const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("Welcome to NamasteDev Backend 🚀 ");
});

module.exports = app;