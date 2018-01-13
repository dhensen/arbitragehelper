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

// if the symbol is ETH/BTC
const getMultiplier = (symbol, inputTarget, ticker) => {
    // inputTarget is the asset for which coins are available now
    // and they are trade for the other asset in a symbol
    // if the inputTarget is the base of the symbol
    if (getBase(symbol) === inputTarget) {
        return ticker.info.askPrice;
    } else {
        return inversePrice(ticker.info.bidPrice);
    }
};

module.exports = {
    getBase,
    getQuote,
    inversePrice,
    getMultiplier,
    getConnectingAsset
}