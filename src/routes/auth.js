const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      photoUrl,
      gender,
      age,
      about,
      skills,
    } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
      gender,
      age,
      about,
      skills,
    });
    await user.save();

    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
