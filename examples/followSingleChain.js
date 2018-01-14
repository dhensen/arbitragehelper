'use strict';

const arbitrageHelper = require('../index');
const { Chain, createChain } = require('../lib/chain');
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
    // let prechain = ['ETH/BTC','CTR/BTC','CTR/ETH'];
    let prechain = ['NULS/ETH', 'NULS/BNB', 'BNB/ETH'];
    let targetAsset = 'ETH';

    const chain = await createChain(exchange, targetAsset, ...prechain);
    console.log(chain.getHashKey());

    while (true) {

        arbitrageHelper.calculateChainProfit(exchange, chain)
            .then(chain => {
                console.log(chain + '; triage: ' + colorProfit(chain.triagePercentage) + ' %');
            });

        await exchange.throttle();
    }


})();