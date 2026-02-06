import {Server} from "socket.io";
import http from "http";
import express from 'express';
import { socketAuthMiddleware } from "../app/middleware/socketMiddleware.js";
import conversationController from "../app/controllers/conversationController.js";
const app =  express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); //{userId - socketId}

io.on("connection", async (socket)=>{
    const user = socket.user;
    console.log(`${user.displayName} online với socket ID ${socket.id}`);

    onlineUsers.set(user._id, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));

    const conversationIds = await conversationController.getUserConversationForSocketIO(user._id);
    
    conversationIds.forEach((id)=>{
        socket.join(id);
    })
    socket.on("join-conversation", (conversationID)=>{
        console.log(`${user.displayName} join conversation ${conversationID}`);
        socket.join(conversationID);
    })
    socket.join(user._id.toString());
    socket.on("disconnect", ()=>{
        console.log("socket disconnected: ",socket.id);
        onlineUsers.delete(user._id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    })


});

export {io, server, app}