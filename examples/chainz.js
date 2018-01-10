'use strict';

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const targetAsset = 'ETH';
arbitrageHelper.findChains(targetAsset, exchange)
    .then(async function (chains) {
        console.log('Found ' + chains.length + ' symbol chains for ' + targetAsset);

        for (let chain of chains) {
            // console.log(chain);
            arbitrageHelper.triageForMarkets(exchange, chain)

            // throttle api calls otherwise your IP gets banned
            await sleep(exchange.rateLimit)
        }
    });