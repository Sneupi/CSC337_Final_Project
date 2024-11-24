const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!'); //FIXME real code
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