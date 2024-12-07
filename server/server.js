
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017';

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

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

app.post('/logout', async (req, res) => {
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