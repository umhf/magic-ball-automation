const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

app.use('/api/trade', tradeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
