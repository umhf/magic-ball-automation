const express = require('express');
const { parseTradeString } = require('../utils/parseTradeString');
const { submitTradeOrder } = require('../services/tradeService');

const router = express.Router();


router.post('/', async (req, res) => {
    const { tradeString } = req.body;
    console.log(tradeString);

    try {
        const tradeDetails = parseTradeString(tradeString);
        console.log(tradeDetails);

        const response = await submitTradeOrder(tradeDetails); // Awaiting the response from the trade submission
        res.json({ message: "Trade submitted successfully", response: response.data }); // Sending back the response data
    } catch (error) {
        res.status(500).json({ error: "Failed to submit trade", details: error.message });
    }
});


module.exports = router;
