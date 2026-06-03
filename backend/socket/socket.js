// socket.io package se Server import kiya
// Ye real-time communication ke liye use hota hai
import {Server} from "socket.io";


// express import kiya
// Backend API banane ke liye
import express from "express";


// Node.js ka built-in http module import
// Express app ko HTTP server me convert karne ke liye
import http from "http";



// Express app create ki
const app = express();



// Express app ko HTTP server me wrap kiya
// socket.io ko HTTP server chahiye hota hai
const server = http.createServer(app);



// Socket.io server create kiya
const io = new Server(server, {

    // CORS settings
    cors:{

        // Sirf is frontend URL ko allow karo
        origin:process.env.URL,

        // Allowed request methods
        methods:['GET','POST']
    }
})



// Object banaya jo userId aur socketId store karega
// Format:
// {
//   userId : socketId
// }

const userSocketMap = {} ; 



// Kisi user ki socket id nikalne ke liye function
// Example:
// getReceiverSocketId("123")

export const getReceiverSocketId = (receiverId) => 
    userSocketMap[receiverId];




// Jab koi new user connect hota hai
io.on('connection', (socket)=>{


    // Frontend se userId le rahe hai
    // socket.handshake.query me frontend ki query data hoti hai

    // Example frontend:
    /*
        io("http://localhost:5000",{
            query:{
                userId:"123"
            }
        })
    */

    const userId = socket.handshake.query.userId;



    // Agar userId exist karti hai
    if(userId){

        // userId ke against socket.id store karo

        // Example:
        // {
        //   "123":"socket123abc"
        // }

        userSocketMap[userId] = socket.id;
    }



    // Sab connected users ko online users bhejo

    // Object.keys(userSocketMap)
    // object ki sari keys return karta hai

    // Example:
    // ["123","456","789"]

    io.emit(
        'getOnlineUsers', 
        Object.keys(userSocketMap)
    );




    // Jab user disconnect hoga
    socket.on('disconnect',()=>{


        // Agar userId exist karti hai
        if(userId){

            // user ko map se remove karo

            // Example:
            // delete userSocketMap["123"]

            delete userSocketMap[userId];
        }



        // Updated online users list fir sabko bhejo
        io.emit(
            'getOnlineUsers', 
            Object.keys(userSocketMap)
        );
    });
})




// app => express routes ke liye export
// server => listen karne ke liye export
// io => socket events ke liye export

export {app, server, io};