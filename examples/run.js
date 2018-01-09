'use strict'

/*

This code should query all possible chains from 1 starting currency
and calculate profit for them all

*** NOTE ***
Idea for future of trading part of the project: 
if chain is meanwhile negative (will be loss)
save initial coin trade amount value
calcuate best path to more of that currency

*/

const symbolFinder = require('../lib/symbolFinder');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();
const helper = new symbolFinder(exchange, false);
const calcChainProfit = require('../lib/calcChainProfit');
const targetAsset = 'ETH';

helper.getCompatibleSymbols(targetAsset).then(symbols => {
    console.log(symbols);
});
