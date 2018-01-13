'use strict';

const arbitrageHelper = require('../index');
const { Chain } = require('../lib/chain');
const ccxt = require('ccxt');
require('ansicolor').nice;

const exchange = new ccxt.binance({
    'apiKey': process.env.BINANCE_API_KEY,
    'secret': process.env.BINANCE_API_SECRET
});


const showBalance = async (exchange) => {
    let binanceBalance = await exchange.fetchBalance()
    console.log("Balance:".bright.green);
    for (let asset in binanceBalance.total) {
        let amount = binanceBalance.total[asset];
        if (amount !== 0) {
            console.log((asset + ': ' + amount).green);
        }
    }
}

// ETC/BTC
// base/quote
// Buy: je wilt base kopen voor quote === je wilt quote verkopen voor base
// Sell: je wilt base verkopen voor quote === je wilt quote kopen voor base
//
// bidPrice: 0.09370000
// de hoogste aanbod prijs momenteel. 1 ETH kost 0.0937000 BTC

// askPrice: 0.09377800
// de laagste vraag prijs momenteel. De laagste prijs mensen je ETH kopen is 0.09377800

const createOrder = async (market, from, fromValue, to) => {
    return new Promise(async (resolve, reject) => {
        const ticker = await exchange.fetchTicker(market.symbol);
        if (market.market.base == from && market.market.quote == to) {
            // from BASE to QUOTE = sell
            // TRX/ETH, sell X trx for eth
            resolve(exchange.createMarketSellOrder (market.market.symbol, fromValue));
            console.log('sell: ', market.market.symbol, ' : ', fromValue);
        } else if (market.market.quote == from && market.market.base == to) {
            // from QUOTE to BASE = buy
            // TRX/ETH, buy TRX for the ETH that you have
            let amountToBuy = fromValue / ticker.info.askPrice;
            resolve(exchange.createMarketBuyOrder (market.market.symbol, amountToBuy));
            console.log('buy: ', market.market.symbol, ' : ', amountToBuy);
        }
    }).catch(err => console.error(err));
}

const getTrades = async (exchange, symbol, orderIds) => {
    let myTrades = await exchange.fetchMyTrades(symbol);
    // console.log(myTrades);
    return myTrades.filter(trade => orderIds.includes(trade.info.orderId));
};

const tradeValue = trade => trade.amount * trade.price;

const getTradeValue = (exchange, symbol, orderId) => {
    return getTrades(exchange, symbol, [orderId]).then(trades => tradeValue(trades[0]));
}

(async function () {

    await exchange.loadMarkets();
    let prechain = ['TRX/ETH','ETH/BTC','TRX/BTC'];

    showBalance(exchange);

    Promise.all(prechain.map(s => exchange.fetchTicker(s)))
    .then(async ([s1, s2, s3]) => {
        let [m1, m2, m3] = prechain.map(s => exchange.getMarket(s));

        let startInput = 100;

        let orderResult = await createOrder(m1, 'TRX', startInput, 'ETH');
        console.log(orderResult);
        await exchange.throttle();
        let tradeValue1 = await getTradeValue(exchange, m1.symbol, orderResult.info.orderId);
        console.log(tradeValue1);
        await exchange.throttle();

        let orderResult2 = await createOrder(m2, 'ETH', tradeValue1, 'BTC');
        console.log(orderResult2);
        let tradeValue2 = await getTradeValue(exchange, m2.symbol, orderResult2.info.orderId);
        console.log(tradeValue2);
        await exchange.throttle();

        let orderResult3 = await createOrder(m3, 'BTC', tradeValue2, 'TRX');
        console.log(orderResult3);
        let tradeValue3 = await getTradeValue(exchange, m3.symbol, orderResult3.info.orderId);
        console.log(tradeValue3);


    }).then(async _ => {
        await exchange.throttle();
        showBalance(exchange);
    });



})();