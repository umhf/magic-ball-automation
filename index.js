require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your static files

// Route for handling form submission
app.post('/api/trade', (req, res) => {
    const { tradeString } = req.body;
    console.log(tradeString); // Placeholder for now

    // TODO: Process the tradeString, convert to symbols, and call the API

    res.json({ message: "Trade string received" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
