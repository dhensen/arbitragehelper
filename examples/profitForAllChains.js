'use strict';

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();
const calculateChainProfit = require('./profit');


