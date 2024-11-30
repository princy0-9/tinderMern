const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectReqModel = require("../models/ConnectionReq");
const User = require("../models/UserSchema");
const reqRouter = express.Router();

reqRouter.post("/request/sent/:status/:toUserId", userAuth, async (req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.json({
                message: "Invalid status Sent "+status,
            })
        }
        const connectReq = new ConnectReqModel({
            fromUserId,
            toUserId,
            status
        })
     
        const existingReq = await ConnectReqModel.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: fromUserId, toUserId: toUserId},
            ]
        })
        if(existingReq){
            return res.status(404).send({message: "Connection already exists"});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({message: "User Doesn't Exists"});  
        }
        const data = await connectReq.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })
    } catch (e){
        res.status(404).send("Error: " + e)
    }
});

reqRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ messaage: "Status not allowed!" });
        }
        const connectionRequest = await ConnectReqModel.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });
        if (!connectionRequest) {
          return res
            .status(404)
            .json({ message: "Connection request not found" });
        }
  
        connectionRequest.status = status;
  
        const data = await connectionRequest.save();
  
        res.json({ message: "Connection request " + status, data });
      } catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }
    
})

module.exports = reqRouter;