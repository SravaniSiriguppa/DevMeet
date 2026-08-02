const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async( req, res, next) => {
    try {
        const { token } = req.cookies;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        const user = await User.findById(decoded._id);

        if(!user) {
            return res.status(404).send("Login again: User not found");
        }

        req.user = user;

        next();

    } catch(err) {
        return res.status(401).send("Unauthorized: Please login again");
    }
}

module.exports = auth;