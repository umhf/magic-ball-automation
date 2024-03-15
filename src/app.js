const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();
dotenv.config();

// Serve static files without token check
app.use(express.static('public'));

app.use(bodyParser.json());

// Token check middleware should be applied only to specific routes that need it
// Move the middleware inside the use call for '/api/trade'
app.use('/api/trade', (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (token == null) return res.sendStatus(401); // If no token is provided, return an unauthorized status

    if (token !== process.env.ACCESS_TOKEN) return res.sendStatus(403); // If the token doesn't match, return forbidden

    next(); // If the token is valid, proceed to the next middleware/route handler
}, tradeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
