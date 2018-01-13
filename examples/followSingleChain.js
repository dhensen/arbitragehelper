'use strict';

const arbitrageHelper = require('../index');
const { Chain } = require('../lib/chain');
const ccxt = require('ccxt');
require('ansicolor').nice;

const colorProfit = percentage => percentage > 0 ? `${percentage}`.green : `${percentage}`.red;

const exchange = new ccxt.binance();

// arbitrageHelper.triageForMarkets(exchange, 'ETH', 'XRP/ETH', 'XRP/BTC', 'ETH/BTC');
// example output: ETH > XRP > BTC > ETH: 0.39387353715572715%


// debug chain: [ETH/BTC', 'ETH/USDT', 'ETH/BTC]
// arbitrageHelper.triageForMarkets(exchange, 'BTC', 'ETH/BTC', 'ETH/USDT', 'ETH/BTC');

(async function () {

    await exchange.loadMarkets();

    // ETH [BNB/ETH', 'BRD/BNB', 'BRD/ETH]; triage: 2.832210819738634 %
    // ETH [BNB/ETH', 'XZC/BNB', 'XZC/ETH]; triage: 3.4833247362673916 %
    // ETH [BNB/ETH', 'ADX/BNB', 'ADX/ETH]; triage: 20.11872471318226 %z
    let prechain = ['ETH/BTC','BCD/ETH','BCD/BTC'];

    Promise.all(prechain.map(s => exchange.getMarket(s)))
    .then(async ([s1, s2, s3]) => {
        const chain = new Chain('BTC', [s1, s2, s3]);

        console.log(chain.getHashKey());

        while (true) {

            arbitrageHelper.calculateChainProfit(exchange, chain)
                .then(chain => {
                    console.log(chain + '; triage: ' + colorProfit(chain.triagePercentage) + ' %');
                });

            await exchange.throttle();
        }
    });


})();