import React from 'react'
import { useSelector, useDispatch } from "react-redux";
// import BigNumber from 'bignumber.js'
import { IAppSlice } from "../../store/slices/app-slice";
import { IAccountSlice } from 'src/store/slices/account-slice';
import { IReduxState } from "../../store/slices/state.interface";
import RoiCalculatorModal from 'src/components/RoiCalculatorModal'

export interface ApyButtonProps {
  lpSymbol: string
  lpLabel: string
  surfPrice: number
  apr: number
  displayApr: string
  addLiquidityUrl: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpSymbol, lpLabel, surfPrice, apr, displayApr, addLiquidityUrl }) => {
  
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const account = useSelector<IReduxState, IAccountSlice>(state =>state.account);
  const lpPrice = app.LPPrice;
  const stakedBalance = account.stakedBalance;
  const tokenBalance = account.LPSupply;
  return (
    <>
      <RoiCalculatorModal
        linkLabel={lpLabel}
        stakingTokenBalance={stakedBalance + tokenBalance}
        stakingTokenSymbol={lpSymbol}
        stakingTokenPrice={lpPrice}
        earningTokenPrice={surfPrice}
        apr={apr}
        displayApr={displayApr}
        linkHref={addLiquidityUrl}
      />
    </>
  )
}

export default ApyButton
