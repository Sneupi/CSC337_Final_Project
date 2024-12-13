const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    session: { type: String },
    icon: { type: String },
    room: { type: String}
});

const User = mongoose.model('User', userSchema);

module.exports = User;