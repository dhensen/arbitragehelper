'use strict';

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();

module.exports = async function triageForMarkets(market1, market2, market3) {
    const markets = await exchange.loadMarkets();

    Promise.all([
        exchange.getMarket(market1),
        exchange.getMarket(market2),
        exchange.getMarket(market3),
        // exchange.getMarket('XRP/ETH'),
        // exchange.getMarket('XRP/BTC'),
        // exchange.getMarket('ETH/BTC'),
    ]).then(([symbol1, symbol2, symbol3]) => (
        arbitrageHelper
            .calculateTriage(exchange, 'ETH', symbol1, symbol2, symbol3)
    ));
}
