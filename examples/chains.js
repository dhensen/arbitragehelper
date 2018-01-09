'use strict';

/*
Chainz.js but by Joey
*/

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();

// exchange.fetchTickers().then(function (tickers) { console.log(Object.keys(tickers)); });

const targetAsset = 'BTC';
const helper = new arbitrageHelper.symbolFinder(exchange, false);
const symbols = helper.getCompatibleSymbols(targetAsset);

function matchSymbol(targetAsset, edgeSymbol, innerSymbol) {
    if (edgeSymbol.base == targetAsset) {
        if (edgeSymbol.quote == innerSymbol.base || edgeSymbol.quote == innerSymbol.quote) {
            return true;
        }
        return false;
    } else if (edgeSymbol.quote == targetAsset) {
        if (edgeSymbol.base == innerSymbol.base || edgeSymbol.base == innerSymbol.quote) {
            return true;
        }
        return false;
    }
    return false;
}

let tickerCache = [];

async function fetchCachedTicker(exchange, symbol) {
    if (!symbol in tickerCache) {
        tickerCache[symbol] = await exchange.fetchTicker(firstSymbol.symbol);
    }
    return tickerCache[symbol];
}

const chainsPromise = symbols.then(async function ({ sourceSymbols, compatibleSymbols }) {
    let chainz = [];

    for (firstSymbol of sourceSymbols) {
        for (secondSymbol of compatibleSymbols) {
            if (!matchSymbol(targetAsset, firstSymbol, secondSymbol)) {
                continue;
            }
            for (thirdSymbol of sourceSymbols) {
                if (matchSymbol(targetAsset, thirdSymbol, secondSymbol)) {
                    // if (chainz.length == 1) {
                    //     continue;
                    // }
                    chainz.push([firstSymbol, secondSymbol, thirdSymbol]);
                    // console.log('[' + firstSymbol.base + ' ' + firstSymbol.quote + ']->[' + secondSymbol.base + ' ' + secondSymbol.quote + ']->[' + thirdSymbol.base + ' ' + thirdSymbol.quote + ']');
                    console.log('[' + firstSymbol.symbol + ']->[' + secondSymbol.symbol + ']->[' + thirdSymbol.symbol + ']');
                }
            }
        }
    }

    return chainz;
});

// chainsPromise.then(function (chains) {
//     console.log('Found ' + chains.length + ' symbol chains for ' + targetAsset);
//     console.log(chains[0]);
//     [ symbol1, symbol2, symbol3 ] = chains[0];
//     calcProfit(1, targetAsset, symbol1, symbol2, symbol3)
// });