/**
 * Returns a number which represents the percentage of profit or losses by performing this trade.
 */

const calcChainProfit = ({ a, b, c }) => 100 * a * b * c - 100;

module.exports = calcChainProfit;
