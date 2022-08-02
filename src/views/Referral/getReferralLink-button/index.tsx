import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../../../hooks";
import { DEFAULD_NETWORK, getAddresses } from "../../../constants";
import { IReduxState } from "../../../store/slices/state.interface";
import { IPendingTxn } from "../../../store/slices/pending-txns-slice";
import "./getReferrallink.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

function GetReferralLinkButton() {
    const { connect, connected,  web3, providerChainID, checkWrongNetwork } = useWeb3Context();
     const dispatch = useDispatch();
    const [isConnected, setConnected] = useState(connected);
    const address = useAddress();

    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    let buttonText = "Get Your Referral Link";
    let clickFunc: any = connect;
    let buttonStyle = {};

    if (isConnected) {
        buttonText = `${window.location.origin}/#/hyperwave?ref=${btoa(address)}`;
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
        <div className="getreferrallink-button" style={buttonStyle} onClick={clickFunc}>
            <p>{buttonText}</p>
            {pendingTransactions.length > 0 && (
                <div className="getreferrallink-button-progress">
                    <CircularProgress size={15} color="inherit" />
                </div>
            )}
        </div>
    );
}

export default GetReferralLinkButton;
