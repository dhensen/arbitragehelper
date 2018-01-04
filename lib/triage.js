'use strict';

module.exports = async function calculateTriage(exchange, targetAsset, input, symbol1, symbol2, symbol3) {

    // symbol1: BTC/ETH
    // symbol2:  XRP/ETH
    // symbol3: XRP/BTC

    // I need these calls to be cached for 100 ms or something like that.

    Promise.all([
        exchange.fetchTicker(symbol1.symbol),
        exchange.fetchTicker(symbol2.symbol),
        exchange.fetchTicker(symbol3.symbol),
    ]).then((tickers) => {
        //                                                             base                quote
        // console.log(ticker1.info); // bidPrice: 0.00019710 betekent: 1 XRP kost 0.00019710 BTC
        // console.log(ticker2.info);
        // console.log(ticker3.info);

        const ticker1 = tickers[0];
        const ticker2 = tickers[1];
        const ticker3 = tickers[2];

        const multiplier1 = symbol1.base == targetAsset ? ticker1.info.bidPrice : 1 / ticker1.info.bidPrice;
        const connectingAsset1 = symbol1.base == targetAsset ? symbol1.quote : symbol1.base;
        // 1 BTC => 5257 XRP

        const multiplier2 = symbol2.base == connectingAsset1 ? ticker2.info.bidPrice : 1 / ticker2.info.bidPrice;
        const connectingAsset2 = symbol2.base == connectingAsset1 ? symbol2.quote : symbol2.base;
        // 5257 XRP => 16.28 ETH

        const multiplier3 = symbol3.base == connectingAsset2 ? ticker3.info.bidPrice: 1 / ticker3.info.bidPrice;

        let newAmount = input * multiplier1 * multiplier2 * multiplier3;

        let difference = newAmount - input;
        if (difference > 0) {
            console.log('profit: ' + difference + ' ' + targetAsset);
        } else {
            console.log('loss: ' + difference + ' ' + targetAsset);
        }        
    });

}