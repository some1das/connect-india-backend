const express = require("express");
const http = require("http")
const socketio = require("socket.io")
const cors = require("cors")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post")
const storyRoutes = require("./routes/story")
const userRoutes = require("./routes/user")
const followUnfollowRoutes = require("./routes/followUnfollow")
const compression = require("compression")
const app = express();
const server = http.createServer(app);



require("dotenv").config();

const port = process.env.PORT || 8000;


app.use(cors())
const io = socketio(server
    , {
        cors: {
            origin: '*',
        }
    }
);
//---- socket related handlers are here--------------------------

io.on("connection", (socket) => {

    const { joinmessage, handleMessages } = require("./chat/headchat")

    joinmessage(io, socket)
    handleMessages(socket, io)

});
mongoose.connect(
    process.env.DB_STRING, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
        console.log("successfully connected to DB....")
    }).catch((err) => {
        console.log("connection unsuccessful")
    })

app.use(bodyParser.json());

app.use("/api", authRoutes)
app.use("/api", postRoutes)
//Story routes
app.use("/api", storyRoutes)

//User routes
app.use("/api", userRoutes)
//Follow unfollow routes
app.use("/api", followUnfollowRoutes)


server.listen(port, () => {
    console.log("server has been started.. ");
});