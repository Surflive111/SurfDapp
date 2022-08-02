import { useRef, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import styled from 'styled-components'
import Fade from '@material-ui/core/Fade';
import { Modal} from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import "../../views/Lpstaking/components/modal.scss";
import { Text, Button, Flex, ButtonMenu, BalanceInput, HelpIcon, ButtonMenuItem, useTooltip, IconButton, CalculateIcon} from '@pancakeswap/uikit'
// import BigNumber from 'bignumber.js'
import RoiCalculatorFooter from './RoiCalculatorFooter'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, {
  CalculatorMode,
  EditingCurrency,
  DefaultCompoundStrategy,
} from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'

export interface RoiCalculatorModalProps {

  earningTokenPrice: number
  apr: number
  displayApr: string
  linkLabel: string
  linkHref: string
  stakingTokenBalance: number
  stakingTokenSymbol: string
  stakingTokenPrice: number
  earningTokenSymbol?: string
  autoCompoundFrequency?: number
  initialState?: any
  initialValue?: string
}

const ScrollableContainer = styled.div`
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`
const Divider = styled.div`
background-color: rgb(56, 50, 65);
height: 1px;
width: 100%;
margin-top: 8px;
margin-bottom: 16px;
`

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  earningTokenPrice,
  apr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  initialValue,
  earningTokenSymbol = 'SURF',
  initialState,
}) => {
  
  const [isOpenROI, setIsOpenROI] = useState(false);
  const closeModal = () => { setIsOpenROI(false)}
  const openModal = () => {setIsOpenROI(true)}

  const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
  const balanceInputRef = useRef<HTMLInputElement | null>(null)

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleEditingCurrency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  } = useRoiCalculatorReducer({ stakingTokenPrice, earningTokenPrice }, initialState)

  const {stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
      '“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.'
      ,{ placement: 'top-end', tooltipOffset: [20, 10] }
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const DURATION = useMemo(() => ['1D', '7D', '30D', '1Y', '5Y'], [])

  return (
    <>
      <IconButton variant="text" onClick={openModal} scale="sm">
        <CalculateIcon width="18px" />
      </IconButton>
      <Modal
        className="modal"         
        open={isOpenROI} 
        onClose={closeModal}  
        aria-labelledby="modal-modal-title" 
        aria-describedby="modal-modal-description" 
        disableScrollLock={false}
        BackdropComponent={Backdrop}
        closeAfterTransition
        BackdropProps={{
            timeout: 800,
        }}
      >
        <Fade in={isOpenROI} >
          <div className='modal-content'>
            <ScrollableContainer>
              <DefaultCompoundStrategy
                apr={apr}
                dispatch={dispatch}
                state={state}
                earningTokenPrice={earningTokenPrice}
                stakingTokenPrice={stakingTokenPrice}
              />
              <Flex flexDirection="column" mb="8px">
                <Flex justifyContent="space-between">
                  <div style={{color: "white", fontSize: "20px", fontFamily: "serif" }}>
                    ROI Calculator
                  </div>
                  <button onClick={closeModal} >x</button>
                </Flex>
                <Divider/>
                <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
                  {stakingTokenSymbol} staked
                </Text>
                <BalanceInput
                  currencyValue={`${conversionValue} ${conversionUnit}`}
                  innerRef={balanceInputRef}
                  placeholder="0.00"
                  value={editingValue}
                  unit={editingUnit}
                  onUserInput={onUserInput}
                  switchEditingUnits={toggleEditingCurrency}
                  onFocus={onBalanceFocus}
                />
                <Flex justifyContent="space-between" mt="8px">
                  <Button
                    scale="xs"
                    p="4px 16px"
                    width="68px"
                    variant="tertiary"
                    onClick={() => setPrincipalFromUSDValue('100')}
                  >
                    $100
                  </Button>
                  <Button
                    scale="xs"
                    p="4px 16px"
                    width="68px"
                    variant="tertiary"
                    onClick={() => setPrincipalFromUSDValue('1000')}
                  >
                    $1000
                  </Button>
                  <Button
                    disabled={
                      !Number.isFinite(stakingTokenPrice) ||
                      !stakingTokenBalance||
                      stakingTokenBalance <= 0||
                      !isAccountLoading
                    }
                    scale="xs"
                    p="4px 16px"
                    width="128px"
                    variant="tertiary"
                    onClick={() =>
                      setPrincipalFromUSDValue((stakingTokenBalance * stakingTokenPrice).toString())
                    }
                  >
                    {"My Balance"}
                  </Button>
                  <span ref={targetRef}>
                    <HelpIcon width="16px" height="16px" color="textSubtle" />
                  </span>
                  {tooltipVisible && tooltip}
                </Flex>
                <>
                  <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
                    Staked for
                  </Text>
                  <FullWidthButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
                    {DURATION.map((duration) => (
                      <ButtonMenuItem key={duration} variant="tertiary">
                        {duration}
                      </ButtonMenuItem>
                    ))}
                  </FullWidthButtonMenu>
                </>
              </Flex>
              <AnimatedArrow calculatorState={state} />
              <Flex>
                <RoiCard
                  earningTokenSymbol={earningTokenSymbol}
                  calculatorState={state}
                  setTargetRoi={setTargetRoi}
                  setCalculatorMode={setCalculatorMode}
                />
              </Flex>
            </ScrollableContainer>
            <RoiCalculatorFooter
              linkLabel={linkLabel}
              linkHref={linkHref}
            />
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default RoiCalculatorModal
