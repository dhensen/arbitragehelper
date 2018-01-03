arbitrageHelper = require('../index');
ccxt = require('ccxt');

var exchange = new ccxt.binance();

// exchange.fetchTickers().then(function (tickers) { console.log(Object.keys(tickers)); });

async function main() {
    await exchange.loadMarkets();
    symbol1 = exchange.getMarket('XRP/BTC');
    symbol2 = exchange.getMarket('XRP/ETH');
    symbol3 = exchange.getMarket('ETH/BTC');

    arbitrageHelper.calculateTriage(exchange, 'BTC', 1, symbol1, symbol2, symbol3);
}


main();


