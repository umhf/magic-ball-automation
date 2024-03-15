const axios = require('axios');
const util = require('util');
const { ensureValidSessionToken } = require('./authService');

const API_BASE_URL = process.env.API_BASE_URL;
const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER;
const NODE_ENV = process.env.NODE_ENV;
const TRADE_QUANTITY = parseInt(process.env.TRADE_QUANTITY)

async function submitTradeOrder(tradeDetails) {
    const { contractType, limitPrice, sellSymbol, buySymbol } = tradeDetails;
    const orderBody = getOrderBody(sellSymbol, buySymbol, limitPrice);

    console.log('+++++++ Submitting Order [Object]: ', util.inspect(orderBody, { showHidden: false, depth: null, colors: true }));

    if (NODE_ENV === "development1") {
        // Development environment: Just log the order and simulate a successful response
        console.log('+++++++ Development Mode: Order not sent. [JSON]: ', JSON.stringify(orderBody));
        return { data: "Simulated order submission in development mode." }; // Simulate a successful response for development
    }

    try {
        const sessionToken = await ensureValidSessionToken();
        const response = await axios.post(`${API_BASE_URL}/accounts/${ACCOUNT_NUMBER}/complex-orders`, orderBody, {
            headers: { 'Authorization': `Bearer ${sessionToken}` },
            'User-Agent': 'spx-trading-bot/1.0'
        });
        console.log("Order submitted successfully: ", util.inspect(response.data, { showHidden: false, depth: null, colors: false }));
        return response; // Return the actual response from the API call
    } catch (error) {
        console.error('Error submitting order:', error.response ? error.response.data : error);
        throw error; // Consider whether to throw the error or handle it differently
    }
}


function getOrderBody(sellSymbol, buySymbol, limitPrice) {
    limitPrice = Math.round(limitPrice * 20) / 20
    const tradeProfitLimit = Math.round(limitPrice * 0.5 * 20) / 20
    const tradeStopTrigger = limitPrice * 2
    const tradeStopLimit = tradeStopTrigger + 0.5

    const orderBody = {
        "type": "OTOCO",
        "trigger-order": {
            "time-in-force": "Day",
            "order-type": "Limit",
            "price": limitPrice,
            "price-effect": "Credit",
            "legs": [{
                "action": "Sell to Open",
                "symbol": sellSymbol,
                "quantity": TRADE_QUANTITY,
                "instrument-type": "Equity Option"
            },
            {
                "action": "Buy to Open",
                "symbol": buySymbol,
                "quantity": TRADE_QUANTITY,
                "instrument-type": "Equity Option"
            }]
        },
        "orders": [
            {
                "order-type": "Limit",
                "price": tradeProfitLimit,
                "price-effect": "Debit",
                "time-in-force": "Day",
                "legs": [{
                    "action": "Sell to Close",
                    "symbol": buySymbol,
                    "quantity": TRADE_QUANTITY,
                    "instrument-type": "Equity Option"
                },
                {
                    "action": "Buy to Close",
                    "symbol": sellSymbol,
                    "quantity": TRADE_QUANTITY,
                    "instrument-type": "Equity Option"
                }]
            },
            {
                "order-type": "Stop Limit",
                "stop-trigger": tradeStopTrigger,
                "price": tradeStopLimit,
                "price-effect": "Debit",
                "time-in-force": "Day",
                "legs": [{
                    "action": "Sell to Close",
                    "symbol": buySymbol,
                    "quantity": TRADE_QUANTITY,
                    "instrument-type": "Equity Option"
                },
                {
                    "action": "Buy to Close",
                    "symbol": sellSymbol,
                    "quantity": TRADE_QUANTITY,
                    "instrument-type": "Equity Option"
                }]
            }
        ]
    }
    return orderBody
}

module.exports = {
    submitTradeOrder
};
