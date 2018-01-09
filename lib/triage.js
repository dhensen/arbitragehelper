'use strict';

const calcChainProfit = require('./calcChainProfit');

// TODO: Get this fee from the market data (this is binance fee 0.1%);
const fee = 0.001;

const getBase = symbol => symbol.market.base;
const getQuote = symbol => symbol.market.quote;
const inversePrice = n => 1 / n;

const getMultiplier = (symbol, target, ticker) => getBase(symbol) === target ? ticker.info.bidPrice : inversePrice(ticker.info.bidPrice);

const getConnectingAsset = (symbol, target) => {
    const base = getBase(symbol);

    return base === target ? getQuote(symbol) : base;
}

module.exports = async function calculateTriage(exchange, target, symbol1, symbol2, symbol3) {

    // I need these calls to be cached for 100 ms or something like that.

    Promise.all([
        exchange.fetchTicker(symbol1.symbol),
        exchange.fetchTicker(symbol2.symbol),
        exchange.fetchTicker(symbol3.symbol),
    ]).then(([ticker1, ticker2, ticker3]) => {

        // Get first multiplier
        const a = getMultiplier(symbol1, target, ticker1);

        // Get second multiplier
        const connectingAsset1 = getConnectingAsset(symbol1, target);
        const b = getMultiplier(symbol2, connectingAsset1, ticker2);

        // Get third multiplier
        const connectingAsset2 = getConnectingAsset(symbol2, connectingAsset1);
        const c = getMultiplier(symbol3, connectingAsset2, ticker3);

        // Calculate profits
        const difference = calcChainProfit({ a, b, c, fee });
        
        // Return findings
        const prefix = [target, connectingAsset1, connectingAsset2, target].join(' > ');

        console.log(prefix + ': ' + difference + '%');      
    });

}
