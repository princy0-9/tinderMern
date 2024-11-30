const mongoose = require("mongoose")

const connectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect`
        }
    }
},{
    timestamps: true
}
)

connectionReqSchema.index({ fromUserId: 1, toUserId: 1 });

connectionReqSchema.pre("save", function(next) {
    const connectReq = this;
    if(connectReq.fromUserId.equals(connectReq.toUserId)){
        throw Error("Cannot Sent request to yourself");
    }
    next();
})
const ConnectReqModel = mongoose.model("ConnectReqModel", connectionReqSchema)
module.exports = ConnectReqModel;