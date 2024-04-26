const express = require('express');
const { body, validationResult } = require('express-validator'); // Add this line
const { parseTradeString } = require('../utils/parseTradeString');
const { submitTradeOrder } = require('../services/tradeService');

const router = express.Router();

router.post('/', [
    body('tradeString').not().isEmpty().withMessage('Trade string is required'),
    // Removed validation for 'tokenInput' as it's handled in headers, not body
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { tradeString } = req.body;

    try {
        const tradeDetails = parseTradeString(tradeString);
        console.log(tradeDetails);

        // Note: Ensure submitTradeOrder is designed to handle the structure of tradeDetails as you're passing it
        const response = await submitTradeOrder(tradeDetails); // Awaiting the response from the trade submission
        // Ensure the response structure is as expected; adjust accordingly
        res.json({ message: "Trade submitted successfully", data: response.data });
    } catch (error) {
        console.error('Failed to submit trade:', error);
        res.status(500).json({ error: "Failed to submit trade", details: error.message });
    }
});

module.exports = router;
