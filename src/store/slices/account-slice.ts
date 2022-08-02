import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { SurfContract, StakingContract, LpReserveContract } from "../../abi";
import { setAll, getApprovedLPAmount } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";
import { Power } from "@material-ui/icons";

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: { surf: string; };

    referrerNum: number;
    referrerRewards: number;

    LPSupply: number;
    ApprovedLP: number;
    userRerralDetails: {
        referrerAddress: string;
        stakingAmount: number;
        receivedReward: number;
    }[];

    pendingReward: number;
    stakedBalance: number;
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    
    const addresses = getAddresses(networkID);
    const surfContract = new ethers.Contract(addresses.SURF_ADDRESS, SurfContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const lpReserveContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, provider);

    //**************************************** SURF ********************************************//
    let surfBalance = "0"; 
    surfBalance = await surfContract.balanceOf(address);

    //**************************************** LP ********************************************//
    let lPSupply = 0; 
    let approvedLP = 0; 
    // approvedLP = await getApprovedLPAmount(address, networkID, provider)/Math.pow(10, 18);
    // lPSupply = await lpReserveContract.balanceOf(address)/Math.pow(10, 18);
    // console.log("Acc-approvedLP", approvedLP);
    // console.log("Acc-lPSupply", lPSupply);
    approvedLP = 0.00;
    lPSupply = 0.00005;

    //**************************************** Referral ********************************************//
    let referrerNum = 0; 
    let referrerRewards = 0; 
    // referrerNum = await stakingContract.userInfor().referrerNum();
    // referrerRewards = (await stakingContract.userInfor().referrerRewards())/Math.pow(10, 5);
    // console.log("Acc-referrerNum",referrerNum);
    // console.log("Acc-referrerRewards", referrerRewards);
    referrerNum = 2;
    referrerRewards = 3.5;

    // userRerralDetails = await stakingContract.userReferralINfo(address);
    let userRerralDetails = [
        {
            referrerAddress: "0x067522f6ef963768Ad49e66a0eC2f9C117990742",
            stakingAmount :  400000000000,
            receivedReward :  60860
        },

        {
            referrerAddress:  "0x5a0f19cE6eE22De387BF4ff308ecF091A91C3a5E",
            stakingAmount :  100000000000,
            receivedReward :  15215
        },

        {
            referrerAddress: "0xC9F9d347Ea1aF3C5e86d9d68a184897B2A9f860E",
            stakingAmount :  500000000000,
            receivedReward :  76075
        },

        {
            referrerAddress:  "0xa42C982B05B873FcaB34a76f01b68070291B6175",
            stakingAmount :  300000000000,
            receivedReward :  45645
        }
    ];
    
    //**************************************** Staking ********************************************//
    let pendingReward = 0; 
    let stakedBalance = 0;
    // pendingReward = (await stakingContract.pendingSURFReward(address))/ Math.pow(10, 5);
    // stakedBalance = (await stakingContract.userInfor(address).amount())/Math.pow(10, 18);
    // console.log("Acc-pendingReward", pendingReward);
    // console.log("Acc-stakedBalance", stakedBalance);
    pendingReward = 0;
    stakedBalance = 0.000;

    return {
        balances: { surf: ethers.utils.formatUnits(surfBalance, 5) },

        referrerNum: referrerNum,
        referrerRewards: referrerRewards,

        LPSupply: lPSupply,
        ApprovedLP: approvedLP,
        userRerralDetails: userRerralDetails,

        pendingReward: pendingReward,
        stakedBalance: stakedBalance,

    };
});



export interface IUserTokenDetails {
    balance: number;
    isBnb?: boolean;
}



export interface IAccountSlice {
    balances: {
        surf: string;
    };
    loading: boolean;
    tokens: { [key: string]: IUserTokenDetails };

    referrerNum: number;
    referrerRewards: number;
    
    LPSupply: number;
    ApprovedLP: number;
    userRerralDetails: {
        referrerAddress: string;
        stakingAmount: number;
        receivedReward: number;
    }[];

    pendingReward: number;
    stakedBalance: number;
}



const initialState = {
    loading: true,
    balances: { surf: "0" },
    tokens: {},
    referrerNum: 0,
    referrerRewards: 0,

    LPSupply: 0,
    ApprovedLP: 0,
    userRerralDetails: [
        {
            referrerAddress: "",
            stakingAmount :  0,
            receivedReward :  0
        },
    ],

    pendingReward: 0,
    stakedBalance: 0
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    }
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
