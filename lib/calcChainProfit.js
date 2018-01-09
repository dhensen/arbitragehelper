// const compose = require('lodash/fp/compose');
// const map = require('lodash/fp/map');

/**
 * Returns a number which represents the percentage of profit or losses by performing this trade.
 */

const withFee = fee => n => n - (n * fee);

// type Props = {
//     a: number,
//     b: number,
//     c: number,
//     fee: number (based on percentage, e.g 0.1% = 0.001)
// };

// Todo: import lodash and compose + map each step with fee --- instead of wrapping in fee three times
const calcChainProfit = ({ a, b, c, fee }) => {
    const minusFee = withFee(fee);
    return minusFee(minusFee(minusFee(100 * a) * b) * c) - 100;
};

module.exports = calcChainProfit;
