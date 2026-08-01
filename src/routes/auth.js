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

authRouter.post("/login", async( req, res ) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId});

        if(!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        return res.status(200).send("Login successful");
    } catch(err) {
        return res.status(400).send(err.message);
    }
})

module.exports = authRouter;
