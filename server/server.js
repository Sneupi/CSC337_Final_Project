
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017';

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('public')); // Serve static frontend files

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
app.post('/login', async (req, res) => {
    // TODO: Gabe implements user login.
});

app.post('/logout', async (req, res) => {
    // TODO: Gabe implements user logout and session cleanup.
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
app.post('/rooms', async (req, res) => {
    // TODO: Implement room creation logic.
    // Steps:
    // 1. Validate request payload (e.g., room name is provided).
    // 2. Check if the room already exists in the database.
    // 3. If not, create and save the room in MongoDB.
    // 4. Respond with success or error message.
});

app.get('/rooms', async (req, res) => {
    // TODO: Fetch list of all available rooms.
    // Steps:
    // 1. Query the Room collection in MongoDB.
    // 2. Return a JSON array of room names or IDs.
});

app.post('/rooms/:roomId/join', async (req, res) => {
    // TODO: Handle user joining a room.
    // Steps:
    // 1. Validate that the room exists.
    // 2. Add the user to the list of active users in the room.
    // 3. Respond with success or an appropriate error message.
});

app.post('/rooms/:roomId/leave', async (req, res) => {
    // TODO: Handle user leaving a room.
    // Steps:
    // 1. Validate that the room exists.
    // 2. Remove the user from the list of active users in the room.
    // 3. Respond with success or an appropriate error message.
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
app.post('/rooms/:roomId/messages', async (req, res) => {
    // TODO: Implement message sending logic.
    // Steps:
    // 1. Validate request payload (e.g., message content and user session).
    // 2. Save the message in the Message collection with a timestamp.
    // 3. Notify other users in the room (if applicable, e.g., via long polling).
    // 4. Respond with success or error message.
});

app.get('/rooms/:roomId/messages', async (req, res) => {
    // TODO: Fetch recent messages for a specific room.
    // Steps:
    // 1. Validate that the room exists.
    // 2. Query the Message collection for messages belonging to the room.
    // 3. Return a JSON array of messages, ordered by timestamp.
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
app.get('/rooms/:roomId/users', async (req, res) => {
    // TODO: Fetch list of active users in a room.
    // Steps:
    // 1. Validate that the room exists.
    // 2. Query the Room collection or a related collection for active users.
    // 3. Return a JSON array of usernames or user IDs.
});

// TODO : ADD ROUTE FOR USER ICON UPDATE

app.get('/rooms/:roomId/create', async (req, res) => {
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
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

/**
 * ====================
 * DATABASE CONNECTION
 * ====================
 * MongoDB connection setup.
 */
mongoose.connect(db_url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database initialization failed:", err);
    });


















/*




const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017';

app.use(express.json()); // For parsing JSON in request bodies
app.use(express.static('public'));

// Routes

// Test route for database functionality (for development only)
// FIXME: Remove before deployment
app.get('/test', async (req, res) => {
    let user = new User({ user_id: 'test_user', session: null, icon: '❤' });
    user.save()
        .then(() => res.status(200).json({ message: "Added user", user: user }))
        .catch((err) => res.status(500).json({ message: err.message, user: user }));
});

*/

/**************** PARTNER'S RESPONSIBILITY: USER MANAGEMENT ****************/

// TODO: Implement /login for user login
// TODO: Implement /logout for user logout
// TODO: Add session management middleware for validating user sessions

/**************** MY TASK: CHAT ROOM MANAGEMENT AND MESSAGING ****************/


/*

// Route: Fetch all active rooms (GET /rooms)
app.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms", error: err.message });
    }
});

// Route: Create a new chat room (POST /rooms)
app.post('/rooms', async (req, res) => {
    const { room_id } = req.body;

    // Make sure Room ID is entered
    if (!room_id) {
        return res.status(400).json({ message: "Room ID is required" });
    }
    try {
        // Check if room already exists
        const existingRoom = await Room.findOne({ room_id });
        if (existingRoom) {
            return res.status(409).json({ message: "Room already exists" });
        }
        // Create a new room
        const newRoom = new Room({ room_id });
        await newRoom.save();
        res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (err) {
        res.status(500).json({ message: "Failed to create room", error: err.message });
    }
});

// Route: Fetch messages for a room (GET /rooms/:room_id/messages)
app.get('/rooms/:room_id/messages', async (req, res) => {
    const { room_id } = req.params;
    try {
        const messages = await Message.find({ room: room_id }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages", error: err.message });
    }
});

// Route: Post a message to a room (POST /rooms/:room_id/messages)
app.post('/rooms/:room_id/messages', async (req, res) => {
    const { room_id } = req.params;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
        return res.status(400).json({ message: "User ID and message content are required" });
    }

    try {
        // Validate room existence
        const room = await Room.findOne({ room_id });
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }

        // Create and save the message
        const newMessage = new Message({
            user: user_id,
            room: room_id,
            content,
            timestamp: new Date()
        });
        await newMessage.save();
        res.status(201).json({ message: "Message sent", messageData: newMessage });
    } catch (err) {
        res.status(500).json({ message: "Failed to send message", error: err.message });
    }
});

// Route: Fetch users in a room (GET /rooms/:room_id/users)
app.get('/rooms/:room_id/users', async (req, res) => {
    const { room_id } = req.params;
    try {
        const users = await User.find({ session: { $ne: null }, room: room_id });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
});

// Route: Add a user to a room (POST /rooms/:room_id/join)
app.post('/rooms/:room_id/join', async (req, res) => {
    const { room_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Validate room existence
        const room = await Room.findOne({ room_id });
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }

        // Update user session with the room
        const user = await User.findOneAndUpdate({ user_id }, { room: room_id }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        res.status(200).json({ message: "User joined room", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to join room", error: err.message });
    }
});

// Route: Remove a user from a room (POST /rooms/:room_id/leave)
app.post('/rooms/:room_id/leave', async (req, res) => {
    const { room_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Validate room existence
        const room = await Room.findOne({ room_id });
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }

        // Update user session to leave the room
        const user = await User.findOneAndUpdate({ user_id }, { room: null }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        res.status(200).json({ message: "User left room", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to leave room", error: err.message });
    }
});



// Start server
mongoose.connect(db_url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database init fail:", err);
    });

*/









































/*
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017';

app.use(express.static('public'));

// Routes
app.get('/test', async (req, res) => {  // FIXME remove test route
    let user = new User({ user_id: 'test_user', session: null, icon: '❤' });
    user.save()
        .then(() => res.status(200).json({ message: "Added user", user: user }))
        .catch((err) => res.status(500).json({ message: err.message, user: user }));
});

// Start server
mongoose.connect(db_url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database init fail:", err);
    });

    */








































/*

    // Import required modules
const express = require('express'); // For setting up the server and handling routes
const mongoose = require('mongoose'); // For database interactions
const bodyParser = require('body-parser'); // Middleware for parsing request bodies

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Set server port
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017'; // Database URL

// Middleware
app.use(express.static('public')); // Serve static files (e.g., HTML, CSS, JS) from 'public' folder
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// ==============================
// Database Connection
// ==============================
mongoose
    .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

// ==============================
// Routes
// ==============================

// TODO: Implement user authentication logic
// Handle user login
app.post('/login', async (req, res) => {
    const { user_id } = req.body;

    // Validate input
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Check if the user exists
        let user = await User.findOne({ user_id });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({ user_id, icon: '😀' }); // TODO: Allow users to choose or upload their icon
            await user.save();
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// TODO: Implement user logout logic
// Handle user logout
app.post('/logout', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Perform any necessary cleanup on logout
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// TODO: Implement room creation and management
// Create a new room
app.post('/rooms', async (req, res) => {
    const { room_id } = req.body;

    if (!room_id) {
        return res.status(400).json({ message: 'Room ID is required' });
    }

    try {
        const existingRoom = await Room.findOne({ room_id });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const room = new Room({ room_id });
        await room.save();
        res.status(201).json({ message: 'Room created', room });
    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// TODO: Implement message sending and retrieval
// Send a message
app.post('/messages', async (req, res) => {
    const { user_id, room_id, content } = req.body;

    // Validate input
    if (!user_id || !room_id || !content) {
        return res.status(400).json({ message: 'All fields are required: user_id, room_id, content' });
    }

    try {
        // Find user and room
        const user = await User.findOne({ user_id });
        const room = await Room.findOne({ room_id });

        if (!user || !room) {
            return res.status(404).json({ message: 'User or room not found' });
        }

        // Create and save the message
        const message = new Message({
            user: user._id,
            room: room._id,
            content,
            timestamp: new Date()
        });
        await message.save();
        res.status(201).json({ message: 'Message sent', message });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve messages for a room
app.get('/rooms/:room_id/messages', async (req, res) => {
    const { room_id } = req.params;

    try {
        const room = await Room.findOne({ room_id });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const messages = await Message.find({ room: room._id }).populate('user', 'user_id icon');
        res.status(200).json({ messages });
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ==============================
// Server Start
// ==============================
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});

// ==============================
// TODO: Additional Features
// ==============================
// - Add WebSocket support for real-time messaging
// - Implement user session management (e.g., using JWT or session cookies)
// - Add user profile functionality (e.g., update icon or username)
// - Implement room deletion or user removal from a room
// - Add server-side validation and sanitization for all input

*/