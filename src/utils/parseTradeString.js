const moment = require('moment');

function extractTradeInfo(text) {
    // Define the regular expression pattern to match the specific trade information
    const pattern = /SELL -1 Vertical SPX 100 \d{2} [A-Z][a-z]{2} \d{2} \d{4}\/\d{4} PUT @\d+(\.\d+)? LMT/;

    // Search for the pattern in the provided text
    const match = text.match(pattern);

    // If a match is found, return it, otherwise return a message indicating no match
    return match ? match[0] : "No trade information found.";
}



function parseTradeString(tradeString) {
    tradeString = extractTradeInfo(tradeString);
    console.log(tradeString);
    const parts = tradeString.split(' ');
    const contractType = parts[2] + (parts[3] === 'Condor' ? ' Condor' : ''); // Vertical or Iron Condor
    const shift = contractType.split(' ').length - 1;
    const symbol = parts[3 + shift]; // SPX
    const datePart = parts[5 + shift] + ' ' + parts[6 + shift] + ' ' + parts[7 + shift]; // 13 Mar 24
    const prices = parts[8 + shift].split('/').map(Number); // [5170, 5165]
    const optionType = parts[9 + shift]; // PUT or CALL
    const dateFormatted = moment(datePart, "DD MMM YY").format("YYMMDD");
    const limitPrice = parseFloat(parts[10 + shift].substring(1));

    let sellSymbol, buySymbol, secondSellSymbol, secondBuySymbol;
    if (contractType === 'Vertical') {
        sellSymbol = `${symbol}W  ${dateFormatted}${optionType.charAt(0)}${prices[0].toString().padStart(5, '0')}000`;
        buySymbol = `${symbol}W  ${dateFormatted}${optionType.charAt(0)}${prices[1].toString().padStart(5, '0')}000`;
    } else if (contractType === 'Iron Condor') {
        const [callSellPrice, callBuyPrice, putSellPrice, putBuyPrice] = prices;
        sellSymbol = `${symbol}W  ${dateFormatted}C${callSellPrice.toString().padStart(5, '0')}000`;
        buySymbol = `${symbol}W  ${dateFormatted}C${callBuyPrice.toString().padStart(5, '0')}000`;
        secondSellSymbol = `${symbol}W  ${dateFormatted}P${putSellPrice.toString().padStart(5, '0')}000`;
        secondBuySymbol = `${symbol}W  ${dateFormatted}P${putBuyPrice.toString().padStart(5, '0')}000`;

    }

    return { contractType, limitPrice, sellSymbol, buySymbol, secondSellSymbol, secondBuySymbol };
}

module.exports = {
    parseTradeString
};