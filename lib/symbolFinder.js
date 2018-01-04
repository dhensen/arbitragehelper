'use strict';

module.exports = class symbolFinder {
    constructor(exchange, verbose) {
        this.exchange = exchange;
        this.verbose = verbose || false;
        // exchange.load_markets().then((r) => {
        //     this.markets = r;
        // });
    }

    // According to docs,
    // Markets can be used to fetch fees
    // However, cant seem to find fee for binance

    // getMarket(symbol) {
    //     if (!!this.markets) {
    //         return this.markets[symbol];
    //     }

    //     return this.exchange.load_markets()
    //         .then((markets) => {
    //             this.markets = markets;
    //             return markets;
    //         })
    //         .then((markets) => markets[symbol]);
    // }

    // getMarket(symbol) {
    //     return this.markets[symbol];
    // }

    getCompatibleSymbols(start) {
        return this.exchange.fetchMarkets().then(function (markets) {
            this.verbose && console.log('There are ' + markets.length + ' total symbols on this exchange.');
            this.verbose && console.log('Looking for all ' + start + ' symbols:');
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
            this.verbose && console.log('\t' + sourceSymbols.map(s => '- ' + s.symbol).join('\n\t'));
            this.verbose && console.log('\tFound ' + otherAssetIds.length + ' other assets compatible with ' + start + '.');
            this.verbose && console.log();

            this.verbose && console.log('Looking for all compatible ' + start + ' symbols to calculate arbitrage:');
            let compatibleSymbols = [];
            for (let symbol of markets) {
                if (otherAssetIds.indexOf(symbol.base) != -1 && otherAssetIds.indexOf(symbol.quote) != -1) {
                    compatibleSymbols.push(symbol);
                }
            }
            this.verbose && console.log('\tFound ' + compatibleSymbols.length + ' symbols to calculate arbitrage for ' + start + '.');
            this.verbose && console.log('\t' + compatibleSymbols.map(s => '- ' + s.symbol).join('\n\t'));

            return { sourceSymbols, compatibleSymbols };
        }.bind(this));
    }
}
