
const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017';

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files
app.use(cookieParser()); // Middleware to parse cookies


// Basic Skeleton for server.js, subject to change if needed

/**
 * ====================
 * SESSION MANAGEMENT
 * (Handled by Gabe)
 * ====================
 * Gabe is responsible for:
 * 1. User login/logout functionality.
 * 2. Session validation and management.
 * 3. Ensuring session IDs are unique and linked to users.
 * 4. Validating session state on protected routes.
 * TODO (Gabe):
 * - Implement login route (POST /login).
 * - Implement logout route (POST /logout).
 * - Middleware for session validation on all routes.
 */
app.post('/api/login', async (req, res) => {
    if (!req.body.userName || !req.body.userIcon) {
        return res.status(404).json({ message: 'Expected JSON attributes: userName, userIcon' });
    }
    // ... the POST body is valid ...
    let userName = req.body.userName;
    let userIcon = req.body.userIcon;
    try {
        let user = await User.findOne({ user_id: userName });
        if (!user) {
            user = new User({ user_id: userName, session: null, icon: userIcon });
            await user.save();
        }
        // ... user exists in db ...
        if (user && user.session) {
            return res.status(404).json({ message: 'Username currently in-use' });
        }
        // ... username is free ...
        const oldSessionId = req.cookies.sessionId;
        if (oldSessionId) {
            let oldUser = await User.findOne({ session: oldSessionId });
            if (oldUser) {
                oldUser.session = null;
                await oldUser.save();
            }
        }
        // ... freed old session cookie (if any) ...
        const sessionId = new mongoose.Types.ObjectId().toString();
        res.cookie('sessionId', sessionId, { httpOnly: true, secure: true });
        user.session = sessionId;
        await user.save();
        // ... created & shared the session cookie ...
        res.status(200).json({ message: 'Logged in successfully' });
        // ... logged OK ...

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Created by Alec, Gets user information
app.get('/api/userInfo', async (req, res) => {
    try {
        let sessionID = req.cookies.sessionId;
        let user = await User.findOne({session: sessionID});
        if(!user){
            return res.status(404).json({ message: 'Could not find user info for your session' });
        }else{
            return res.status(200).json({username: user.user_id, icon: user.icon});
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching user info", error: err.message }); // Handle unexpected errors
    }
});

app.post('/api/logout', async (req, res) => {
    try { req.cookies.sessionId } catch (error) {
        return res.status(404).json({ message: error.message });
    }
    // ... the POST body is valid ...
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(404).json({ message: 'No session found' });
    }
    // ... session cookie is present ...
    try {
        let user = await User.findOne({ session: sessionId });
        if (!user) {
            return res.status(404).json({ message: 'Invalid session' });
        }
        // ... session found in db ...
        user.session = null;
        await user.save();
        res.clearCookie('sessionId');
        res.status(200).json({ message: 'Logged out successfully' });
        // ... cleared ...
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * ========================
 * ROOM MANAGEMENT
 * (Handled by Cody)
 * ========================
 * Responsibilities:
 * 1. Create a new room.
 * 2. Fetch a list of available rooms.
 * 3. Allow users to join or leave rooms.
 * 4. Handle errors for nonexistent or duplicate rooms.
 * 5. Ensure room data is persistent in MongoDB.
 */



// Create a room
app.post('/api/rooms', async (req, res) => {
    try {
        const { roomName } = req.body; // Extract room name from the request body
        if (!roomName) {
            return res.status(400).json({ message: "Room name is required" }); // Validate input
        }

        const existingRoom = await Room.findOne({ room_id: roomName }); // Check if the room already exists
        if (existingRoom) {
            return res.status(409).json({ message: "Room already exists" }); // Handle duplicate room error
        }
        const rooms = await Room.find().select('room_id -_id');
        if(rooms.length >= 5){
            return res.status(405).json({message: "Maximum number of rooms created"});
        }

        const newRoom = new Room({ room_id: roomName }); // Create a new room object
        await newRoom.save(); // Save the new room in the database

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom, // Include room details in the response
        });
    } catch (err) {
        res.status(500).json({
            message: "Error creating the room",
            error: err.message, // Send error details in response
        });
    }
});

// Fetch all available rooms by id
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find().select('room_id -_id'); // Fetch all room IDs from the database

        if (rooms.length === 0) {
            return res.status(200).json({
                message: "No rooms found",
                rooms: [], // Return an empty list if no rooms exist
            });
        }

        res.status(200).json({
            message: "Rooms fetched successfully",
            rooms: rooms.map(room => room.room_id), // Extract and return room IDs only
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching rooms",
            error: err.message, // Send error details in response
        });
    }
});

// Add users to a room
app.post('/api/rooms/:roomId/join', async (req, res) => {
    try {
        const { roomId } = req.params; // Get room ID from URL parameters
        const { userId } = req.body; // Extract user ID from request body

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to join a room" }); // Validate input
        }

        const room = await Room.findOne({ room_id: roomId }); // Ensure the room exists
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.activeUsers && room.activeUsers.includes(userId)) {
            return res.status(409).json({ message: "User already in the room" }); // Prevent duplicate user addition
        }

        room.activeUsers = room.activeUsers || []; // Initialize active users if not present
        room.activeUsers.push(userId); // Add user to the room
        await room.save(); // Save the updated room to the database

        res.status(200).json({ message: "Joined room successfully", room }); // Return success response
    } catch (err) {
        res.status(500).json({ message: "Error joining the room", error: err.message }); // Handle unexpected errors
    }
});

// Allow user to leave a room
app.post('/api/rooms/:roomId/leave', async (req, res) => {
    try {
        const { roomId } = req.params; // Get room ID from URL parameters
        const { userId } = req.body; // Extract user ID from request body

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to leave a room" }); // Validate input
        }

        const room = await Room.findOne({ room_id: roomId }); // Ensure the room exists
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // If there are active users in the room
        if (room.activeUsers) {
            // Iterate over the 'activeUsers' array and create a new array that includes only the IDs
            // that are not equal to the specified 'userId'. This effectively removes 'userId' from the list
            // while keeping all other user IDs intact.
            room.activeUsers = room.activeUsers.filter(id => id !== userId); // Remove user from the active users list
            await room.save(); // Save the updated room to the database
        }

        res.status(200).json({ message: "Left room successfully", room }); // Return success response
    } catch (err) {
        res.status(500).json({ message: "Error leaving the room", error: err.message }); // Handle unexpected errors
    }
});

/**
 * =====================
 * MESSAGE MANAGEMENT
 * (Handled by Cody)
 * =====================
 * Responsibilities:
 * 1. Send messages to a room.
 * 2. Fetch recent messages for a room.
 * 3. Ensure message data is stored persistently in MongoDB.
 */


// Send message to a room
app.post('/api/rooms/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params; // Extract room ID from URL
        const { userId, content } = req.body; // Extract user ID and message content from request body

        if (!content || !userId) {
            return res.status(400).json({ message: "Message content and user ID are required" }); // Validate input
        }

        // Fetch the Room's ObjectId and details
        const room = await Room.findOne({ room_id: roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Fetch the User's ObjectId and details
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create and save the message
        const message = new Message({
            user: user._id, // Use the ObjectId of the user
            room: room._id, // Use the ObjectId of the room
            content,
            timestamp: new Date(),
        });

        await message.save(); // Save the message to the database

        // Respond with the user and room names
        res.status(201).json({
            message: "Message sent successfully",
            messageData: {
                user: { user_id: user.user_id, icon: user.icon }, // Include user details
                room: room.room_id, // Include room name
                content: message.content,
                timestamp: message.timestamp,
            },
        }); // Respond with success
    } catch (err) {
        res.status(500).json({ message: "Error sending message", error: err.message }); // Handle unexpected errors
    }
});



// Fetch Messages from a room
app.get('/api/rooms/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params; // Extract room ID from URL

        const room = await Room.findOne({ room_id: roomId }); // Ensure the room exists
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const messages = await Message.find({ room: room._id })
            .populate({ 
                path: 'user', 
                select: 'user_id icon -_id' // Select user_id and icon, explicitly exclude _id
            })
            .populate({ 
                path: 'room', 
                select: 'room_id -_id' // Select room_id and exclude _id
            })
            .sort({ timestamp: 1 }); // Fetch and sort messages by timestamp

        res.status(200).json({ messages }); // Respond with the messages
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages", error: err.message }); // Handle unexpected errors
    }
});


/**
 * =====================
 * USER MANAGEMENT
 * (Handled by Cody)
 * =====================
 * Responsibilities:
 * 1. Fetch the list of active users in a room.
 * 2. Ensure proper handling of disconnected users.
 */

// Fetch the list of active users in a room
app.get('/api/rooms/:roomId/users', async (req, res) => {
    try {
        const { roomId } = req.params; // Extract room ID from URL

        const room = await Room.findOne({ room_id: roomId }); // Ensure the room exists
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ activeUsers: room.activeUsers || [] }); // Respond with the list of active users
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message }); // Handle unexpected errors
    }
});

// Fetch the id of the room the user is in
app.get('/api/rooms/id', async (req, res) => {
    try {
        let sessionID = req.cookies.sessionId;
        let user = await User.findOne({session: sessionID});
        if(!user){
            return res.status(404).json({ message: 'Could not find user info for your session' });
        }else{
            await Room.findOne({activeUsers});
            return res.status(200).json();
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching room info", error: err.message }); // Handle unexpected errors
    }
});

/**
 * ====================
 * ERROR HANDLING
 * (Shared Responsibility)
 * ====================
 * Responsible for adding robust error handling:
 * - Catch database errors and send proper responses.
 * - Validate all input payloads to prevent crashes.
 * - Handle edge cases like duplicate usernames, nonexistent rooms, etc.
 */
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error for debugging
    res.status(500).json({ error: 'Something went wrong on the server!' }); // Respond with a generic error
});

/**
 * ====================
 * DATABASE CONNECTION
 * ====================
 * Connect to MongoDB and start the server
 */
mongoose.connect(db_url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database initialization failed:", err); // Log database connection errors
    });
