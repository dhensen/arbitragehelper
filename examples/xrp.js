
arbitrageHelper = require('../index');
ccxt = require('ccxt');

var helper = new arbitrageHelper.symbolFinder(new ccxt.binance());
helper.getCompatibleSymbols('XRP');