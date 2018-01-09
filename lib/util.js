'use strict';

const getBase = symbol => symbol.market.base;
const getQuote = symbol => symbol.market.quote;
const inversePrice = n => 1 / n;

const getConnectingAsset = (symbol, target) => {
    const base = getBase(symbol);

    if (base === target) {
       return getQuote(symbol);
    }

    return base;
}

const getMultiplier = (symbol, target, ticker) => getBase(symbol) === target ? ticker.info.bidPrice : inversePrice(ticker.info.bidPrice);

module.exports = {
    getBase,
    getQuote,
    inversePrice,
    getMultiplier,
    getConnectingAsset
}