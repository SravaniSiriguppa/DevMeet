const express = require("express");
const User = require("../models/User");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
