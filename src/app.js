const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();
dotenv.config();

// Define rate limit rule
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.static('public'));
app.use(bodyParser.json());

// Combine rate limiting, token check, and tradeRoutes into a single chain for '/api/trade'
app.use('/api/trade', apiLimiter, (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (token == null) {
        return res.sendStatus(401); // If no token is provided, return an unauthorized status
    }

    if (token !== process.env.ACCESS_TOKEN) {
        return res.sendStatus(403); // If the token doesn't match, return forbidden
    }

    next(); // If the token is valid, proceed to the next middleware/route handler
}, tradeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
