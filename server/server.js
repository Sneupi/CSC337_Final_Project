const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const port = 3000;

// Routes
app.get('/test', async (req, res) => {  // FIXME remove test route
    let user = new User({ user_id: 'test_user', session: null, icon: '❤' });
    user.save()
        .then(() => res.status(200).json({ message: "Added user", user: user }))
        .catch((err) => res.status(500).json({ message: err.message, user: user }));
});

// Start server
mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.error("Database init fail:", err);
    });