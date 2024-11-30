const express = require("express")
const connectDB = require("./config/database");
const bcrypt  = require("bcrypt")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json())
app.use(cookieParser())


const User = require("./models/UserSchema");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const reqRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRouter)

app.get("/feed", async (req,res)=>{
    const { userId } = req.body;
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e){
        res.status(404).send("could nt find feed")
    }
})

connectDB().then(()=>{
    console.log("DB connected")
    app.listen(3000, ()=>{
        console.log("running")
    })  
}).catch((err)=>{
    console.log("not connected")
})
