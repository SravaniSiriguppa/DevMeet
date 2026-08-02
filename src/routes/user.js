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

userRouter.get("/connections", auth, async (req, res) => {
  const loggedInUser = req.user;

  const connections = await ConnectionRequest.find({
    $or: [
      { fromUserId: loggedInUser._id, status: "accepted" },
      { toUserId: loggedInUser._id, status: "accepted" },
    ],
  })
    .populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills",
    )
    .populate(
      "toUserId",
      "firstName lastName photoUrl age gender about skills",
    );

  const data = connections.map((row) => {
    if (row.fromUserId._id.equals(loggedInUser._id)) {
      return row.toUserId;
    }
    return row.fromUserId;
  });

  return res.status(200).json({
    data,
  });
});

module.exports = userRouter;
