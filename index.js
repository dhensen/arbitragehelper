
const symbolFinder = require('./lib/symbolFinder');
const { calculateTriage, triageForMarkets } = require('./lib/triage');
const { findChains } = require('./lib/chain');

console.log(typeof(symbolFinder));

module.exports = { symbolFinder, calculateTriage, triageForMarkets, findChains }