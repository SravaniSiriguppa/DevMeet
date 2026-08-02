const express = require("express");

const profileRouter = express.Router();
const auth = require("../middleware/auth");

profileRouter.get("/view", auth, (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

profileRouter.patch("/edit", auth, async (req, res) => {
    try {
        const allowedUpdates = ["firstName", "lastName", "photoUrl","gender", "age", "about", "skills"];
    
        const updates = Object.keys(req.body);
    
        const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update));
    
        if(!isAllowedUpdate) {
            return res.status(400).send("Invalid updates");
        }
    
        const loggedInUser = req.user;
    
        updates.forEach((field) => {
            loggedInUser[field] = req.body[field];
        })
    
        await loggedInUser.save();
    
        return res.status(200).send("Profile updated successfully");
    } catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;