const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;