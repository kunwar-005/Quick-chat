import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './db.js';
import userrouter from './routes/userroutes.js';
import messagerouter from './routes/messageroutes.js';




const app = express();
const server = http.createServer(app);



// middlewares
app.use(cors());
app.use(express.json({limit:"5mb"}));


// initisalizing soket io
export const io= new Server(server,{
    cors: {origin:"*"}
})

// store online users

export const usersocketmap={}  //userIsd:socketId

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("userconnected",userId)
    if(userId)usersocketmap[userId]=socket.id

    // emit all online users to all connected users
    io.emit("getonlineusers",Object.keys(usersocketmap))

    socket.on ("disconnect",()=>{
        console.log("user disconnected",userId)
        delete usersocketmap[userId]
        io.emit("getonlineusers",Object.keys(usersocketmap))

    })
})


// routes setup
app.use("/api/status", (req, res) => {
    res.status(200).send("Server is running");
});
app.use("/api/auth", userrouter);
app.use("/api/messages",messagerouter)
// db connection
await connectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
