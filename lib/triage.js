'use strict';

const calcChainProfit = require('./calcChainProfit');
const { getConnectingAsset, getMultiplier } = require('./util');

// TODO: Get this fee from the market data (this is binance fee 0.1%);
const fee = 0.001;

function calculateFee(exchange, ticker, from, to, amount) {
    return fee;
}

const substractFee = fee => amount => amount - (amount * fee);

async function calculateChainProfit(exchange, chain) {
    const target = chain.targetAsset;
    const [symbol1, symbol2, symbol3] = chain.symbols;

    return Promise.all([
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

        const fee1 = substractFee(calculateFee(exchange, ticker1));
        const fee2 = substractFee(calculateFee(exchange, ticker1));
        const fee3 = substractFee(calculateFee(exchange, ticker1));

        const difference = fee3(fee2(fee1(100 * a) * b) * c) - 100;

        chain.triagePercentage = difference;
        return chain;
    }).catch(error => {
        console.error(error);
    });
}


async function triageForMarkets(exchange, chain) {
    // J, why do we need to pull in markets?
    // const markets = await exchange.loadMarkets();

    // return Promise.all([
    //     exchange.getMarket(chain.symbols[0].symbol),
    //     exchange.getMarket(chain.symbols[1].symbol),
    //     exchange.getMarket(chain.symbols[2].symbol),
    // ]).then(([symbol1, symbol2, symbol3]) => (
    //     calculateTriage(exchange, chain.targetAsset, ...chain.symbols)
    // ));

    return calculateChainProfit(exchange, chain);
}

module.exports = {
    triageForMarkets
}