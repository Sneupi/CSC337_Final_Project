const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_id: {
        type: String, required: true, unique: true
    },
    activeUsers: {
        type: [String], // Array of strings to store user IDs
        default: [] // Initialize as an empty array
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
