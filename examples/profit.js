'use strict';

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
const exchange = new ccxt.binance();

arbitrageHelper.triageForMarkets(exchange, 'XRP/ETH', 'XRP/BTC', 'ETH/BTC');

// example output: ETH > XRP > BTC > ETH: 0.39387353715572715%