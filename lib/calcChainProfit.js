// const compose = require('lodash/fp/compose');
// const map = require('lodash/fp/map');


/**
 * Returns a number which represents the percentage of profit or losses by performing this trade.
 */
const substractFee = fee => amount => amount - (amount * fee);

// type Props = {
//     a: number,
//     b: number,
//     c: number,
//     fee: number (based on percentage, e.g 0.1% = 0.001)
// };

const calcChainProfit = ({ a, b, c, feePercentage }) => {
    if (feePercentage == undefined) {
        feePercentage = 0;
    }
    const minusFee = substractFee(feePercentage);
    return minusFee(minusFee(minusFee(100 * a) * b) * c) - 100;
};

module.exports = calcChainProfit;
