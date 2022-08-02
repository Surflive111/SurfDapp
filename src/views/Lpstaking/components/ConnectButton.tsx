import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../store/slices/state.interface";
import { IPendingTxn } from "../../../store/slices/pending-txns-slice";
import {useWeb3Context } from "../../../hooks";
import { DEFAULD_NETWORK, getAddresses } from "../../../constants";
import { Button } from '@pancakeswap/uikit';



const ConnetButton = ({

}) => {

      //************************************connect wallet*****************************//
      const { connect, connected,  web3, providerChainID, checkWrongNetwork } = useWeb3Context();
      const dispatch = useDispatch();
      const [isConnected, setConnected] = useState(connected);
      let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
          return state.pendingTransactions;
      });
  
      let buttonText = "Connnect Wallet";
      let clickFunc: any = connect;
      let buttonStyle = {};
  
      if (isConnected) {
          buttonText = `Connected`;
      }
  
      if (pendingTransactions && pendingTransactions.length > 0) {
          buttonText = `${pendingTransactions.length} Pending `;
          clickFunc = () => {};
      }
  
      if (isConnected && providerChainID !== DEFAULD_NETWORK) {
          buttonText = "Wrong network";
          buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
          clickFunc = () => {
              checkWrongNetwork();
          };
      }
  
      useEffect(() => {
          setConnected(connected);
      }, [web3, connected]);

  return (
    <Button variant="success" width="100%" marginTop="8px" onClick={clickFunc}>{buttonText}</Button>
  )

}

export default ConnetButton;
