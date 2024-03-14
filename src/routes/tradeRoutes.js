const express = require('express');
const { parseTradeString } = require('../utils/parseTradeString');

const router = express.Router();

router.post('/', (req, res) => {
    const { tradeString } = req.body;
    console.log(tradeString)
    const tradeDetails = parseTradeString(tradeString);
    console.log(tradeDetails)

    // Call your service functions here with tradeDetails
    res.json({ message: "Trade details parsed", tradeDetails });
});

module.exports = router;
