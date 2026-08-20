const express = require("express");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const User = require("../models/User");
const auth = require('../middleware/auth');

const authRouter = express.Router();
const app = express();
app.use(express.json())
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

    const savedUser = await user.save();

    const token = jsonWebToken.sign(
            {_id: user._id,},
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });

    res.json({message:"User added successfully", data: savedUser});
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

        const token = jsonWebToken.sign(
            {_id: user._id,},
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });

        return res.status(200).send(user);
    } catch(err) {
        return res.status(400).send(err.message);
    }
})

authRouter.post("/forgotPassword", async (req, res) => {
  try {
    const { emailId } = req.body;

    const user = await User.findOne({ emailId });

    console.log(user)

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(200).send(
        "If an account exists with this email, a password reset link has been sent."
      );
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token expires in 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    await sendEmail({
      to: user.emailId,
      subject: "Reset your DevMeet password",
      html: `
        <h2>Password Reset</h2>

        <p>Hi ${user.firstName},</p>

        <p>
          We received a request to reset your DevMeet password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <a
          href="${resetURL}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#4f46e5;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>

        <p>
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      `,
    });

    return res.status(200).send(
      "If an account exists with this email, a password reset link has been sent."
    );

  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});

authRouter.post("/resetPassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("Password is required");
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send(
        "Password reset link is invalid or has expired"
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Replace old password
    user.password = hashedPassword;

    // Clear reset token so it cannot be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).send("Password reset successful");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});

authRouter.post("/logout", async(req, res) => {
    try{
        res.clearCookie("token");

        return res.send("Logout Successful");
    } catch(err) {
        return res.status(400).send(err.message);
    }
})

module.exports = authRouter;
