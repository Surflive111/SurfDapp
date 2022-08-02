import { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, ExpandableLabel, LinkExternal} from '@pancakeswap/uikit'

const Footer = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => theme.colors.dropdown};
`

const Divider = styled.div`
background-color: rgb(56, 50, 65);
height: 1px;
width: 100%;
`

interface RoiCalculatorFooterProps {
  linkLabel: string
  linkHref: string

}

const RoiCalculatorFooter: React.FC<RoiCalculatorFooterProps> = ({
  linkLabel,
  linkHref,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Footer p="16px" flexDirection="column">
      <Divider/>
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? 'Hide' : 'Details'}
      </ExpandableLabel>
      {isExpanded && (
        <Box px="8px">
          <Flex justifyContent="center" mt="24px">
            <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
          </Flex>
        </Box>
      )}
    </Footer>
  )
}

export default RoiCalculatorFooter
