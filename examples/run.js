'use strict'

const symbolFinder = require('../lib/symbolFinder');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();
const helper = new symbolFinder(exchange, false);
const calcChainProfit = require('../lib/calcChainProfit');
const targetAsset = 'ETH';

function init() {
    helper.getCompatibleSymbols(targetAsset).then(symbols => {
        console.log(symbols);
        
        // Promise.all(
        //     symbols.map(s => helper.exchange.fetchTicker(s))
        // ).then((result) => {
        //     const data = result.map(symbol => {
        //         return {
        //             name: symbol.symbol,
        //             high: symbol.high,
        //         };
        //     });

        
            // console.log(data);
        
            // const profit = calcChainProfit({
            //     a: result[0].high,
            //     b: result[1].high,
            //     c: result[2].high,
            //     fee: 0.001
            // });
        
            // console.log(profit);
        // });
    });
}
// binanceTradingFee = 0.1%

init();

/*

How to get one chain calculated:

Loop:

1. Get the amount of XRP you can buy with 1 ETH.
fetchOrderBook('XRP/ETH')
2. Get the amount of BTC you can buy with 1 XRP
3. Get the amount of ETH you can buy with 1 BTC

4. Calculate the profits with calcSingleChain



How to get them all calculated:

Initialize: query all possible chains.
Assuming we're always starting with ETH,
we can do this by calling getCompatibleSymbols.

Loop:
Map over the symbols.
1. Get the amount of ALT1 you can buy with 1 ETH.
2. Get the amount of ALT2 you can buy with 1 ALT1
3. Calculate the profits with calcSingleChain

*/
