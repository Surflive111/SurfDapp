import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "../../store/slices/account-slice";
import {useWeb3Context } from "../../hooks";
import { Tag, Flex, Button } from '@pancakeswap/uikit';
import ConnetButton from "./components/ConnectButton";
import HarvestAction from "./HarvestAction";
import { ApproveLP } from "src/store/slices/staking-slice";
import StakeAction from './StakeAction'
import BigNumber from 'bignumber.js'
import "./lpstaking.scss";



const ActionCotainer = () => {

  const dispatch = useDispatch();
  const {connected, connect, address, provider, chainID, checkWrongNetwork} = useWeb3Context();
  const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading); 
  const account = useSelector<IReduxState, IAccountSlice>(state => state.account);
  const stakedBalance = account.stakedBalance;
  // const tokenBalance = new BigNumber(account.LPSupply);
  const approvedBalance =account.ApprovedLP;
  const isapproved = !isAccountLoading &&  approvedBalance && approvedBalance >0;
  const [requestedApproval, setRequestedApproval] = useState(false)

  
  const handleApprove = async () => {
    setRequestedApproval(true)
    dispatch(ApproveLP({address, networkID:chainID, provider}));
    setRequestedApproval(false)
    return;
  }

  const renderApprovalOrStakeButton = () => {
    return isapproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        approvedBalance={approvedBalance}
        tokenName={""}
        addLiquidityUrl={"https://pancakeswap.finance/add/BNB/0x6Cbd8ECaF789324233039FDB8711a29f3f8d0a61"}
      />
    ) : (
      <Button variant="success" width="100%" marginTop="8px" disabled={requestedApproval}  onClick={handleApprove} >Approve contract</Button>
    )
  }

  return (
    <>
      <div className="lpstaking-title">
        <span className="lpstaking-title2">SURF</span>
        <span className="lpstaking-title1"> EARNED</span>
      </div>
      <HarvestAction/>
      <div className="lpstaking-title">
        <span className="lpstaking-title2">SURF-BNB LP</span>
        <span className="lpstaking-title1"> STAKED</span>
      </div>
      {!connected ? <ConnetButton/>: renderApprovalOrStakeButton()}
    </>
  )

}

export default ActionCotainer;
