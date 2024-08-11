const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongodb = require('./db')
dotenv.config()
const PORT = process.env.PORT
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const cors = require("cors")
// const { notFound, errorHandler } = require('./middleware/errorMiddleware')
app.use(cors({
    origin: "http://localhost:3000"
}))
// app.use((req, res, next)=>{
//     res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     next();
// })

app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
// app.use(notFound)
// app.use(errorHandler)

const server = app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
    mongodb()
})

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("Connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("user Joined Room: ",room)
    })

    socket.on('new message',(newMessageReceived)=>{
        let chat =  newMessageReceived.chat

        if(!chat.users){
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id){
                return;
            }

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    })

    socket.on("typing",(room)=> socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=> socket.in(room).emit("stop typing"));
    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})

