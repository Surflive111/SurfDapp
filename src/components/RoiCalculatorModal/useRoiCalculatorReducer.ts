import React, { useEffect, useReducer, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import merge from 'lodash/merge'
import { getInterestBreakdown, getPrincipalForInterest, getRoi } from 'src/helpers/compoundApyHelpers'

/**
 * This hook is handling all the calculator state and calculations.
 * UI connected to it is merely representation of the data and buttons to trigger actions
 */

const TOKEN_PRECISION = 12
const USD_PRECISION = 2

// Used to track/react which currency user is editing (i.e. USD amount or Token amount)
export enum EditingCurrency {
  TOKEN,
  USD,
}

// Calculator works in 2 modes
export enum CalculatorMode {
  ROI_BASED_ON_PRINCIPAL, // User edits principal value and sees what ROI they get
  PRINCIPAL_BASED_ON_ROI, // User edits ROI value and sees what principal they need to invest to reach it
}

export interface RoiCalculatorReducerState {
  controls: {
    stakingDuration: number // index of active staking duration button in ButtonMenu
    mode: CalculatorMode
    editingCurrency: EditingCurrency
  }
  data: {
    principalAsToken: string // Used as value for Inputs
    principalAsUSD: string // Used as value for Inputs
    roiUSD: number
    roiTokens: number
    roiPercentage: number // ROI expressed in percentage relative to principal
  }
}

const defaultState: RoiCalculatorReducerState = {
  controls: {
    stakingDuration: 0,
    mode: CalculatorMode.ROI_BASED_ON_PRINCIPAL,
    editingCurrency: EditingCurrency.USD,
  },
  data: {
    principalAsToken: '0.00',
    principalAsUSD: '',
    roiUSD: 0,
    roiTokens: 0,
    roiPercentage: 0,
  },
}

const roiCalculatorReducer = (
  state: RoiCalculatorReducerState,
  action: { type: string; payload?: any },
): RoiCalculatorReducerState => {
  switch (action.type) {
    case 'setStakingDuration': {
      const controls = { ...state.controls, stakingDuration: action.payload }
      return {
        ...state,
        controls,
      }
    }
    case 'setPrincipal': {
      const { principalAsUSD, principalAsToken } = action.payload
      const data = { ...state.data, principalAsUSD, principalAsToken }
      const controls = { ...state.controls, mode: CalculatorMode.ROI_BASED_ON_PRINCIPAL }
      return {
        controls,
        data,
      }
    }
    case 'setPrincipalForTargetRoi': {
      const { principalAsUSD, principalAsToken, roiPercentage } = action.payload
      const data = { ...state.data, principalAsUSD, principalAsToken, roiPercentage }
      return {
        ...state,
        data,
      }
    }
    case 'setCalculatorMode': {
      const mode = action.payload
      const controls = { ...state.controls, mode }
      if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
        const roiUSD = parseFloat(state.data.roiUSD.toFixed(USD_PRECISION))
        const data = { ...state.data, roiUSD }
        return { controls, data }
      }
      return { ...state, controls }
    }
    case 'setRoi': {
      const data = { ...state.data, ...action.payload }
      return { ...state, data }
    }
    case 'setTargetRoi': {
      const { roiUSD, roiTokens } = action.payload
      const data = { ...state.data, roiUSD, roiTokens }
      const controls = { ...state.controls, mode: CalculatorMode.PRINCIPAL_BASED_ON_ROI }
      return { controls, data }
    }
    case 'toggleEditingCurrency': {
      const currencyAfterChange =
        state.controls.editingCurrency === EditingCurrency.USD ? EditingCurrency.TOKEN : EditingCurrency.USD
      const controls = { ...state.controls, editingCurrency: currencyAfterChange }
      return { ...state, controls }
    }
    default:
      return state
  }
}

const useRoiCalculatorReducer = (
  {
    stakingTokenPrice,
    earningTokenPrice,
  }: {
    stakingTokenPrice: number
    earningTokenPrice: number
  },
  initialState: RoiCalculatorReducerState,
) => {
  const [state, dispatch] = useReducer(roiCalculatorReducer, merge(defaultState, initialState))

  // Handler for principal input when in USD mode
  const setPrincipalFromUSDValue = (amount: string) => {
    const principalAsTokenBN = new BigNumber(amount).div(stakingTokenPrice)
    const principalAsToken = principalAsTokenBN.gt(0) ? principalAsTokenBN.toFixed(TOKEN_PRECISION) : '0.00'
    dispatch({ type: 'setPrincipal', payload: { principalAsUSD: amount, principalAsToken } })
  }

  // Handler for principal input when in Token mode
  const setPrincipalFromTokenValue = useCallback(
    (amount: string) => {
      const principalAsUsdBN = new BigNumber(amount).times(stakingTokenPrice)
      const principalAsUsdString = principalAsUsdBN.gt(0) ? principalAsUsdBN.toFixed(USD_PRECISION) : '0.00'
      dispatch({
        type: 'setPrincipal',
        payload: { principalAsUSD: principalAsUsdString, principalAsToken: amount },
      })
    },
    [stakingTokenPrice],
  )

  // Handler for staking duration buttons
  const setStakingDuration = (stakingDurationIndex: number) => {
    // console.log("staking Duration", stakingDurationIndex);
    dispatch({ type: 'setStakingDuration', payload: stakingDurationIndex })
  }


  // Handler for principal input mode switch
  const toggleEditingCurrency = () => {
    dispatch({ type: 'toggleEditingCurrency' })
  }

  const setCalculatorMode = (modeToSet: CalculatorMode) => {
    dispatch({ type: 'setCalculatorMode', payload: modeToSet })
  }

  // Handler for ROI input
  const setTargetRoi = (amount: string) => {
    const targetRoiAsTokens = new BigNumber(amount).div(earningTokenPrice)
    dispatch({
      type: 'setTargetRoi',
      payload: { roiUSD: +amount, roiTokens: targetRoiAsTokens.isNaN() ? 0 : targetRoiAsTokens.toNumber() },
    })
  }

  return {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleEditingCurrency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  }
}

export default useRoiCalculatorReducer;

interface DefaultCompoundStrategyProps{
  state: RoiCalculatorReducerState;
  apr: number;
  earningTokenPrice: number;
  stakingTokenPrice: number;
  dispatch: React.Dispatch<{
      type: string;
      payload?: any;
  }>
}

export function DefaultCompoundStrategy({
  state,
  apr,
  earningTokenPrice,
  stakingTokenPrice,
  dispatch,
}: DefaultCompoundStrategyProps) {
  const { principalAsUSD, roiUSD } = state.data
  const {stakingDuration, mode } = state.controls

  // Calculates and sets ROI whenever related values change
  useEffect(() => {
    if (mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL) {
      const principalInUSDAsNumber = parseFloat(principalAsUSD)
      const interestBreakdown = getInterestBreakdown({
        principalInUSD: principalInUSDAsNumber,
        apr,
        earningTokenPrice,
      })
      const hasInterest = !Number.isNaN(interestBreakdown[stakingDuration])
      const roiTokens = hasInterest ? interestBreakdown[stakingDuration] : 0
      const roiAsUSD = hasInterest ? roiTokens * earningTokenPrice : 0
      const roiPercentage = hasInterest
        ? getRoi({
            amountEarned: roiAsUSD,
            amountInvested: principalInUSDAsNumber,
          })
        : 0
      dispatch({ type: 'setRoi', payload: { roiUSD: roiAsUSD, roiTokens, roiPercentage } })
    }
  }, [
    principalAsUSD,
    apr,
    stakingDuration,
    earningTokenPrice,
    mode,
    dispatch,
  ])

 // Calculates and sets principal based on expected ROI value
  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
      const principalForExpectedRoi = getPrincipalForInterest(
        roiUSD,
        apr,
      )
      const principalUSD = !Number.isNaN(principalForExpectedRoi[stakingDuration])
        ? principalForExpectedRoi[stakingDuration]
        : 0
      const principalToken = new BigNumber(principalUSD).div(stakingTokenPrice)
      const roiPercentage = getRoi({
        amountEarned: roiUSD,
        amountInvested: principalUSD,
      })
      dispatch({
        type: 'setPrincipalForTargetRoi',
        payload: {
          principalAsUSD: principalUSD.toFixed(USD_PRECISION),
          principalAsToken: principalToken.toFixed(TOKEN_PRECISION),
          roiPercentage,
        },
      })
    }
  }, [
    stakingDuration,
    apr,
    mode,
    roiUSD,
    stakingTokenPrice,
    dispatch,
  ])

  return null
}