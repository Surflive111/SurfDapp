import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap/uikit'
import { BigNumber } from 'bignumber.js'

interface ModalInputProps {
  max: number
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: number
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

// const getBoxShadow = ({ isWarning = false, theme }) => {
//   if (isWarning) {
//     return theme.shadows.warning
//   }

//   return theme.shadows.inset
// }

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  border-color: white;
  margin: 0 8px;
  padding: 0 8px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
}) => {
  const isBalanceZero = max == 0 || !max

  const displayBalance = (balance: number) => {
    if (isBalanceZero) {
      return 0
    }
    const balanceBigNumber = new BigNumber(balance)
    if (balanceBigNumber.gt(0) && balanceBigNumber.lt(0.0001)) {
      return balanceBigNumber.toLocaleString()
    }
    return balanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  return (
    <div style={{ position: 'relative', marginTop: "20px", display: "flex", justifyContent:"space-between"}}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">{max}</Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Button scale="sm" onClick={onSelectMax}>
            Max
          </Button>
          {/* <Text fontSize="16px">{symbol}</Text> */}
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          'No tokens to stake'
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {symbol}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
