const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Store active rooms and their users
const rooms = {};

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);

        // Add user to room's user list
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push({ id: socket.id, username });

        // Notify all users in the room
        io.to(room).emit("updateUsers", rooms[room]);

        // Notify the room about the new user
        socket.to(room).emit("message", `${username} has joined the room!`);

        // Listen for messages from the user
        socket.on("chatMessage", (message) => {
            io.to(room).emit("message", `${username}: ${message}`);
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            rooms[room] = rooms[room].filter((user) => user.id !== socket.id);
            io.to(room).emit("updateUsers", rooms[room]);
            socket.to(room).emit("message", `${username} has left the room.`);
        });
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
