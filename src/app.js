const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to NamasteDev Backend 🚀 ");
});

module.exports = app;