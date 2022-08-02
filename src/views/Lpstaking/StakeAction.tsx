import React, { useCallback } from 'react'
import {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Heading} from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import Balance from './components/Balance'
import { IAppSlice } from "../../store/slices/app-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'src/helpers/formatBalance'
import { Stake, StakeWithReferrer, Withdraw } from "src/store/slices/staking-slice";
import {isAddress} from "../../helpers/isAddress"

import {DepositModal1} from './components/DepositModal1'
import {DepositModal2} from './components/DepositModal2'
import {WithdrawModal} from './components/WithdrawModal'


interface FarmCardActionsProps {
  stakedBalance: number
  approvedBalance: number
  tokenName: string
  addLiquidityUrl: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  approvedBalance,
  tokenName,
  addLiquidityUrl,
}) => {

  const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context(); 
  const dispatch = useDispatch();

  const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const lpPrice = app.LPPrice;
  // const addStakingBalance =new BigNumber(approvedBalance - stakedBalance);

  //*******************************referrer address*****************************//
  const { pathname, search } = useLocation();
  let referrer ="";
  useEffect(() => {
      if (search.slice(5) && isAddress(atob(search.slice(5)))) {
        referrer = atob(search.slice(5));
        console.log("referrer:", referrer);
      }
  }, [referrer]);

  const handleStake = async (amount: number) => {
    if(referrer)
      dispatch(StakeWithReferrer({address, networkID:chainID, provider, amount, referrer}));
    else
      dispatch(Stake({address, networkID:chainID, provider, amount}));
  }


  const handleUnstake = async (amount: number) => {
    dispatch(Withdraw({networkID:chainID, provider, amount }));
  }

  
  // const displayBalance = useCallback(() => {
  //   const stakedBigNum = new BigNumber(stakedBalance);
  //   const stakedBalanceBigNumber = getBalanceAmount(stakedBigNum)
  //   if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.001)) {
  //     // return getFullDisplayBalance(stakedBalance, 18, 15).toLocaleString()
  //     return stakedBalanceBigNumber.toLocaleString()
  //   }
  //   return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  // }, [stakedBalance])


  const renderStakingButtons = () => {
    return stakedBalance == 0 ? (
      <DepositModal1 max={approvedBalance} onConfirm={handleStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl}/>
    ) : (
      <IconButtonWrapper>
        <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} />
        <DepositModal2 max={approvedBalance-stakedBalance} onConfirm={handleStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl}/>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={stakedBalance == 0 ? 'textDisabled' : 'text'}>{stakedBalance}</Heading>
        {stakedBalance >0  && lpPrice >0 && (
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={lpPrice * stakedBalance}
            unit=" USD"
            prefix="~"
          />
        )}
      </Flex>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
