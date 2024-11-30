const express = require("express")
const validator = require("validator")
const bcrypt = require("bcrypt")

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try {
        const user = req.user;
        res.send(user)
    } catch (e){
        res.status(404).send("token nt valid" + e)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try {
        if (!validateEditProfileData(req)) {
          throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({
          message: `${loggedInUser.firstName}, your profile updated successfuly`,
          data: loggedInUser,
        });
      } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
})

profileRouter.patch("/profile/forgotpassword", userAuth, async (req,res)=>{
    try {
        const { password } = req.body;
        const loggedInUser = req.user;
        
        if (!validator.isStrongPassword(password)) {
            throw new Error("Please enter a strong Password!");
        }

        loggedInUser.password =  await bcrypt.hash(password, 10);;
        await loggedInUser.save();
        res.json({
          message: `${loggedInUser.firstName}, your profile updated successfuly`,
          data: loggedInUser,
        });
      } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
})

module.exports = profileRouter;