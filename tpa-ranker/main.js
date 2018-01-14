

const arbitrageHelper = require('../index');
const ccxt = require('ccxt');
require('ansicolor').nice;
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');


const optionDefinitions = [
  {
    name: 'exchange',
    alias: 'e',
    type: String,
    multiple: false,
    description: 'The exchange to be used. Must be an exchange define in CCXT.\nExample: binance',
    typeLabel: '[underline]{exchange}',
  },
  {
    name: 'target',
    alias: 't',
    type: String,
    multiple: false,
    description: 'The target asset. Example: BTC',
    typeLabel: '[underline]{asset}',
  },
  {
    name: 'threshold',
    type: Number,
    multiple: false,
    description: 'Display TPA pairs with percentage above threshold',
    typeLabel: '[underline]{threshold}',
  },
  // { name: 'verbose', alias: 'v', type: Boolean },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    defaultOption: false,
    description: 'Print this usage guide.',
  },
];

// TODO: hook up verbose to actually do something

const sections = [
  {
    header: 'tpa-ranker',
    content: 'The tpa-ranker continuously calculates the profit/loss percentage and ranks the TPA pairs for a given target asset.',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
];

const usage = getUsage(sections);

const defaultOptions = {
  exchange: null,
  help: false,
  target: null,
  threshold: 0,
  // verbose: false,
};
const options = Object.assign(defaultOptions, commandLineArgs(optionDefinitions));
console.log(options);

if (options.help === true || options.target === null || options.exchange === null) {
  process.stdout.write(`${usage}\n`);
  process.exit(options.help === true ? 0 : 1);
}


const colorProfit = percentage => (percentage > 0 ? `${percentage}`.green : `${percentage}`.red);

const exchange = (function () {
  try {
    return new ccxt[options.exchange]();
  } catch (error) {
    console.error(`exchange ${options.exchange} is not available`);
    process.exit(1);
  }
}());


const targetAsset = options.target;
const percentageThreshold = options.threshold;

console.log(typeof (percentageThreshold));


arbitrageHelper.findChains(targetAsset, exchange)
  .then(async (chains) => {
    console.log(`Found ${chains.length} symbol chains for ${targetAsset}`);

    while (true) {
      for (const chain of chains) {
        arbitrageHelper.calculateChainProfit(exchange, chain).then((chain) => {
          if (chain.triagePercentage >= percentageThreshold) {
            console.log(`${chain}; triage: ${colorProfit(chain.triagePercentage)} %`);
          } else {
            console.log('.');
          }
        });

        // throttle api calls otherwise your IP gets banned
        await exchange.throttle();
      }
    }
  });
