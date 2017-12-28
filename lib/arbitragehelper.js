'use strict';

var ccxt = require('ccxt');

class ArbitrageHelper {
    constructor(exchange) {
        this.exchange = exchange;
    }

    getCompatibleSymbols(start) {
        return this.exchange.fetchMarkets().then(function (markets) {
            console.log('There are ' + markets.length + ' total symbols on this exchange.');
            console.log('Looking for all ' + start + ' symbols:');
            let sourceSymbols = [];
            let otherAssetIds = [];
            for (let symbol of markets) {
                if (symbol.base == start || symbol.quote == start) {
                    sourceSymbols.push(symbol);
                    // console.log(symbol.base, symbol.quote);
                    // Add the symbol id to a list if it not already on it, prevent the start symbol to be added
                    if (otherAssetIds.indexOf(symbol.base) == -1 && symbol.base != start) {
                        otherAssetIds.push(symbol.base);
                    }
                    if (otherAssetIds.indexOf(symbol.quote) == -1 && symbol.quote != start) {
                        otherAssetIds.push(symbol.quote);
                    }
                }
            }
            console.log('\tFound ' + otherAssetIds.length + ' other assets compatible with ' + start + '.');
            console.log('\t' + sourceSymbols.map(s => '- ' + s.symbol).join('\n\t'));
            console.log();

            console.log('Looking for all compatible ' + start + ' symbols to calculate arbitrage:');
            let compatibleSymbols = [];
            for (let symbol of markets) {
                if (otherAssetIds.indexOf(symbol.base) != -1 && otherAssetIds.indexOf(symbol.quote) != -1) {
                    compatibleSymbols.push(symbol.symbol);
                }
            }
            console.log('\tFound ' + compatibleSymbols.length + ' symbols to calculate arbitrage for ' + start + '.');
            console.log('\t' + compatibleSymbols.map(s => '- ' + s).join('\n\t'));

            return { sourceSymbols, compatibleSymbols };
        });
    }
}

// Usage:
// I'm a javascript nobody so I dont know how to run-test my module. npm link???
var helper = new ArbitrageHelper(new ccxt.binance());
helper.getCompatibleSymbols('XRP');

module.exports = ArbitrageHelper;