'use strict';

const getBase = symbol => symbol.base || symbol.market.base;
const getQuote = symbol => symbol.quote || symbol.market.quote;
const inversePrice = n => 1 / n;

const getConnectingAsset = (symbol, target) => {
    const base = getBase(symbol);
    const quote = getQuote(symbol);

    if (base === target) {
        return quote;
    } else if (quote === target) {
        return base;
    } else {
        throw 'the target asset ' + target + ' does not occur in symbol ' + symbol.symbol;
    }
}

const getMultiplier = (symbol, target, ticker) => getBase(symbol) === target ? ticker.info.bidPrice : inversePrice(ticker.info.bidPrice);

module.exports = {
    getBase,
    getQuote,
    inversePrice,
    getMultiplier,
    getConnectingAsset
}