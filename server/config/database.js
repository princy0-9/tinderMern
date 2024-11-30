const mongoose = require("mongoose")

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://text:WhgZorRRcmOrRbeS@cluster0.kcnsq.mongodb.net/learnMern");
}

module.exports = connectDB;