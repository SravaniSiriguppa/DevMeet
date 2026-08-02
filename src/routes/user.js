const express = require("express");

const auth = require("../middleware/auth");

const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");

const userRouter = express.Router();

userRouter.get("/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills",
    );

    return res.status(200).send(connectionRequests);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = userRouter;
