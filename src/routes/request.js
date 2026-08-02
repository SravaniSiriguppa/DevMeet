const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequests");

const auth = require("../middleware/auth");
const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", auth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;

    const allowedStatuses = ["interested", "ignored"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid Status");
    }

    const user = await User.findById(toUserId);

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).send("Invalid User ID");
    }

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const fromUser = req.user;

    if (fromUser._id.equals(toUserId)) {
      return res.status(400).send("Can not send request to yourself");
    }

    const connectionRequestExists = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: fromUser._id,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUser._id,
        },
      ],
    });

    if (connectionRequestExists) {
      return res.status(401).send("Connection already exists");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId: fromUser._id,
      toUserId,
      status,
    });

    await connectionRequest.save();

    return res.status(200).send("Request sent successfully");
  } catch (err) {
    console.error(err);
    return res.status(400).send(err.message);
  }
});

module.exports = requestRouter;
