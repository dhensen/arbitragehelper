'use strict';

const symbolFinder = require('./symbolFinder');
const { getConnectingAsset } = require('./util');

class Chain {
  constructor(targetAsset, symbols) {
    this.targetAsset = targetAsset;
    this.symbols = symbols;
    this.triagePercentage = 100;
  }

  toString() {
    return this.targetAsset + " '" + this.symbols.map(s => s.symbol).join("','") + "'";
  }

  getHashKey() {
    return this.targetAsset + '-' + this.symbols.map(s => s.symbol).join('-');
  }
}

function getOtherAsset() {

}

function matchSymbol(targetAsset, symbol1, symbol2, symbol3) {
  try {
    let c1 = getConnectingAsset(symbol1, targetAsset); // 'ETH/BTC' c1 = ETH
    let c2 = getConnectingAsset(symbol2, c1); // 'QTUM/ETH' c2 = QTUM
    let c3 = getConnectingAsset(symbol3, targetAsset); // 'QTUM/BTC' c3 = QTUM

    return c3 === c2;
  } catch (error) {
    return false;
  }

  return false;
}

async function createChain(exchange, targetAsset, symbolName1, symbolName2, symbolName3) {
  return Promise.all([
    exchange.getMarket(symbolName1),
    exchange.getMarket(symbolName2),
    exchange.getMarket(symbolName3)
  ])
    .then(async ([s1, s2, s3]) => {
      return new Chain(targetAsset, [s1, s2, s3]);
    });
}

async function findChains(targetAsset, exchange) {
  const helper = new symbolFinder(exchange, false);
  const symbols = helper.getCompatibleSymbols(targetAsset);

  return symbols.then(async function ({ sourceSymbols, compatibleSymbols }) {
    let chains = [];

    for (let firstSymbol of sourceSymbols) {
      for (let secondSymbol of compatibleSymbols) {
        for (let thirdSymbol of sourceSymbols) {
          if (!matchSymbol(targetAsset, firstSymbol, secondSymbol, thirdSymbol)) {
            continue;
          }
          let chain = new Chain(targetAsset, [firstSymbol, secondSymbol, thirdSymbol])
          // let chain = createChain(exchange, targetAsset, firstSymbol, secondSymbol, thirdSymbol);
          chains.push(chain);
          // console.log(`${chain}`);
        }
      }
    }

    return chains;
  });
}

module.exports = {
  Chain,
  findChains,
  createChain,
}