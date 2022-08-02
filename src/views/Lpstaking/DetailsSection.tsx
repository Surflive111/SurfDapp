import React from 'react'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from '@pancakeswap/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  totalValueFormatted?: number
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  totalValueFormatted,
  addLiquidityUrl,
}) => {

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>Total Liquidity:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      <LinkExternal color="success" href={addLiquidityUrl}>Get SURF-BNB LP </LinkExternal>
      <LinkExternal color="success" href={bscScanAddress}>View Contract</LinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
