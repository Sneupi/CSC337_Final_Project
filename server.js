const express = require('express');
const app = express();
const port = 3000;
const host = "localhost"

app.use(express.json());
app.use(express.static("public_html"));

// TODO add routes

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});