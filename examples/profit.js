const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();

// exchange.fetchTickers().then(function (tickers) { console.log(Object.keys(tickers)); });

async function main() {
    await exchange.loadMarkets();

    Promise.all([
        exchange.getMarket('XRP/ETH'),
        exchange.getMarket('XRP/BTC'),
        exchange.getMarket('ETH/BTC'),
    ]).then(([symbol1, symbol2, symbol3]) => (
        arbitrageHelper.calculateTriage(exchange, 'ETH', symbol1, symbol2, symbol3)
    ));
}

main();
