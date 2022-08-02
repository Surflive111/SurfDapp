// 1 day, 7 days, 30 days, 1 year, 5 years
const DAYS_TO_CALCULATE_AGAINST = [1, 7, 30, 365, 1825]

/**
 *
 * @param principalInUSD - amount user wants to invest in USD
 * @param apr - farm or pool apr as percentage. If its farm APR its only cake rewards APR without LP rewards APR
 * @param earningTokenPrice - price of reward token
 * @param compoundFrequency - how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @param performanceFee - performance fee as percentage
 * @returns an array of token values earned as interest, with each element representing interest earned over a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export const getInterestBreakdown = ({
  principalInUSD,
  apr,
  earningTokenPrice,
}: {
  principalInUSD: number
  apr: number
  earningTokenPrice: number
}) => {

  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const aprAsDecimal = apr / 100

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  // and also cause rounding errors
  const isHighValueToken = Math.round(earningTokenPrice / 100) > 0
  const roundingDecimalsNew = isHighValueToken ? 8 : 5

  return DAYS_TO_CALCULATE_AGAINST.map((days) => {
    const daysAsDecimalOfYear = days / 365
    // Calculate the starting TOKEN balance with a dollar balance of principalInUSD.
    const principal = principalInUSD / earningTokenPrice
    let interestEarned = principal * aprAsDecimal * (daysAsDecimalOfYear)

    return parseFloat(interestEarned.toFixed(roundingDecimalsNew))

  })
}

/**
 * @param interest how much USD amount you aim to make
 * @param apr APR of farm/pool
 * @param compoundingFrequency how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @returns an array of principal values needed to reach target interest, with each element representing principal needed for a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export const getPrincipalForInterest = (
  interest: number,
  apr: number,

) => {
  return DAYS_TO_CALCULATE_AGAINST.map((days) => {
    const apyAsDecimal = getApy(apr, days)
    // console.log('inside', interest, apyAsDecimal)
    // const apyAsBN = new BigNumber(apyAsDecimal).decimalPlaces(6, BigNumber.ROUND_DOWN).toNumber()
    return parseFloat((interest / apyAsDecimal).toFixed(2))
  })
}

/**
 * Given APR returns APY
 * @param apr APR as percentage
 * @param compoundFrequency how many compounds per day
 * @param days if other than 365 adjusts (A)PY for period less than a year
 * @param performanceFee performance fee as percentage
 * @returns APY as decimal
 */
export const getApy = (apr: number,  days: number) => {
  const daysAsDecimalOfYear = days / 365
  const aprAsDecimal = apr / 100
  let apyAsDecimal = (aprAsDecimal) * daysAsDecimalOfYear
  return apyAsDecimal
}

export const getRoi = ({ amountEarned, amountInvested }: { amountEarned: number; amountInvested: number }) => {
  if (amountInvested === 0) {
    return 0
  }
  const percentage = (amountEarned / amountInvested) * 100
  return percentage
}
