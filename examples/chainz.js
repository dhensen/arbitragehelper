
arbitrageHelper = require('../index');
ccxt = require('ccxt');

var exchange = new ccxt.binance();

exchange.fetchTickers().then(function (tickers) { console.log(Object.keys(tickers)); });

// return;

var targetAsset = 'BTC';
var helper = new arbitrageHelper.symbolFinder(exchange, false);
symbols = helper.getCompatibleSymbols(targetAsset);

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

function calcProfit(symbol1, place1, symbol2, place2, symbol3, place3) {
    // symbol1: BTC/ETH
    // place1: base
    // symbol2:  XRP/ETH
    // place2: quote
    // symbol3: XRP/BTC
    // place3: quote
}

var tickerCache = [];
async function fetchCachedTicker(exchange, symbol) {
    if (!symbol in tickerCache) {
        tickerCache[symbol] = await exchange.fetchTicker(firstSymbol.symbol);
    }
    return tickerCache[symbol];
}

var chainsPromise = symbols.then(async function ({ sourceSymbols, compatibleSymbols }) {
    var chainz = [];
    for (firstSymbol of sourceSymbols) {
        for (secondSymbol of compatibleSymbols) {
            if (!matchSymbol(targetAsset, firstSymbol, secondSymbol)) {
                continue;
            }
            for (thirdSymbol of sourceSymbols) {
                if (matchSymbol(targetAsset, thirdSymbol, secondSymbol)) {
                    if (chainz.length == 1) {
                        continue;
                    }
                    chainz.push([firstSymbol, secondSymbol, thirdSymbol]);
                    console.log('[' + firstSymbol.base + ' ' + firstSymbol.quote + ']->[' + secondSymbol.base + ' ' + secondSymbol.quote + ']->[' + thirdSymbol.base + ' ' + thirdSymbol.quote + ']');
                }
            }
        }
    }

    return chainz;
});

chainsPromise.then(function (chains) {
    console.log('Found ' + chains.length + ' symbol chains for ' + targetAsset);
    console.log(chains[0]);

    calcProfit()
});