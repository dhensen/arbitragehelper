# Arbitrage Helper

Arbitrage helper lets you specify a target asset on a crypto exchange for which you want to do triangular arbitrage.

## Usage

When running this code for a target asset, lets say `BTC` it gives you two lists:
1. a list of all symbols that trade from or to `BTC`
2. a list of all symbols that can trade between all assets from the previous list

```
$ vim lib/arbitragehelper.js
# scroll down and call getCompatibleSymbols with the `XRP` symbol
$ node lib/arbitragehelper.js
There are 231 total symbols on this exchange.
Looking for all XRP symbols:
        Found 2 other assets compatible with XRP.
        - XRP/BTC
        - XRP/ETH

Looking for all compatible XRP symbols to calculate arbitrage:
        Found 1 symbols to calculate arbitrage for XRP.
        - ETH/BTC
```

## Using CCXT

I've implemented this using CCXT. This allows you to easily use another exchange. In the example I have used Binance but you could for example just as easily use Poloniex like this:
```
var helper = new ArbitrageHelper(new ccxt.poloniex());
helper.getCompatibleSymbols('XRP');
# ...save then run it again:
node lib/arbitragehelper.js
There are 99 total symbols on this exchange.
Looking for all XRP symbols:
        Found 2 other assets compatible with XRP.
        - XRP/BTC
        - XRP/USDT

Looking for all compatible XRP symbols to calculate arbitrage:
        Found 1 symbols to calculate arbitrage for XRP.
        - BTC/USDT
```

## Todo

- [ ] Turn this into a proper npm package

> Disclaimer: I am **not** a NodeJs/JS developer
> I know `node lib/arbitragehelper.js` is not the way to call use it
> You can help me make this into a proper npm module if you like!

## Contributions

Contributions are welcome via a pull request.