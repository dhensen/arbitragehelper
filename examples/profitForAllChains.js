'use strict';

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
require('ansicolor').nice;

const colorProfit = percentage => percentage > 0 ? `${percentage}`.green : `${percentage}`.red;


const exchange = new ccxt.binance();
const targetAsset = 'TRX';
const percentageThreshold = 0;

arbitrageHelper.findChains(targetAsset, exchange)
    .then(async function (chains) {
        console.log('Found ' + chains.length + ' symbol chains for ' + targetAsset);

        while (true) {
            for (let chain of chains) {
                arbitrageHelper.calculateChainProfit(exchange, chain).then(chain => {
                    if (chain.triagePercentage >= percentageThreshold) {
                        console.log(chain + '; triage: ' + colorProfit(chain.triagePercentage) + ' %');
                    } else {
                        console.log('.');
                    }
                });

                // throttle api calls otherwise your IP gets banned
                await exchange.throttle();
            }
        }
    });