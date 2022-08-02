import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import {  SurfContract, LpReserveContract, Erc20Contract, StakingContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import { getLastRebasedTime } from "../../helpers"

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

interface IAppDetails {

    totalSupply: number;
    marketCap: number;
    currentBlock: number;
    circSupply: number;
    oneDayRate: number;
    fiveDayRate: number;
    dailyRate:number
    currentBlockTime: number;
    lastRebasedTime: number;
    treasuryValue: number;
    sifValue: number;
    firepitBalance:number;
    bnbLiquidityValue: number;
    backedLiquidity: string;
    marketPrice: number;
    currentApy: number;

    referrerNum: number;
    referrerRewards: number;

    TotalLP: number;
    LPPrice: number;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails): Promise<IAppDetails> => {

        const addresses = getAddresses(networkID);
        const surfContract = new ethers.Contract(addresses.SURF_ADDRESS, SurfContract, provider);
        const busdContract = new ethers.Contract( addresses.BUSD_ADDRESS, Erc20Contract, provider);
        const pairContract = new ethers.Contract( addresses.PAIR_ADDRESS, LpReserveContract, provider);
        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

        //******************************** SURF ****************************************//
        const bnbPrice = getTokenPrice("BNB");
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
         const lastRebasedTime = await getLastRebasedTime(networkID, provider);
        // const lastRebasedTime = 1655771467;
        const marketPrice = (await getMarketPrice(networkID, provider)) * bnbPrice;
        const totalSupply = (await surfContract.totalSupply()) / Math.pow(10, 5);
        const circSupply = totalSupply - (await surfContract.balanceOf(addresses.FIREPIT_ADDRESS)) / Math.pow(10,5);
        const marketCap = circSupply * marketPrice;
        const fiveDayRate = Math.pow(1 + 0.0001027 , 5 * 12 * 24 ) - 1;
        const oneDayRate = Math.pow(1 + 0.0001027 ,  12 * 24 ) - 1;
        const dailyRate = Math.pow(1 + 0.0001027, 24 * 12) - 1;
        const reserves = await pairContract.getReserves();
        const poolBNBAmount = reserves[0] / Math.pow(10,18)
        const bnbLiquidityValue = poolBNBAmount * bnbPrice * 2;
        const treasurySurfValue = (await surfContract.balanceOf(addresses.TREASURY_ADDRESS) / Math.pow(10,5)) * marketPrice ;
        const treasuryBNBAmount = await provider.getBalance(addresses.TREASURY_ADDRESS);
        const treasuryBNBValue = Number(ethers.utils.formatEther(treasuryBNBAmount)) * bnbPrice;
        const treasuryBUSDValue = Number(await busdContract.balanceOf( addresses.TREASURY_ADDRESS )) / Math.pow(10,18);
        const treasuryValue = treasuryBNBValue + treasurySurfValue + treasuryBUSDValue;
        const backedLiquidity = "100%";
        const firepitBalance = (await surfContract.balanceOf(addresses.FIREPIT_ADDRESS))/ Math.pow(10,5);
        const sifBNBAmount = await provider.getBalance(addresses.SIF_ADDRESS) ;
        const sifBUSDAmount = (await busdContract.balanceOf( addresses.SIF_ADDRESS )) / Math.pow(10,18);
        const sifValue = Number(ethers.utils.formatEther(sifBNBAmount)) * bnbPrice + Number(sifBUSDAmount);
        const currentApy = Math.pow(1 + 0.0001027, 365 * 12 * 24) - 1 ;

        //************************************** LP ********************************************//
        // const totalSurfInPool = surfContract.balanceOf(addresses.PAIR_ADDRESS)/ Math.pow(10, 5);
        const totalLPInPool =pairContract.totalSupply()/Math.pow(10, 18);
        // const lptokenprice = 2 * totalSurfInPool * marketPrice / totalLPInPool;
        // console.log("App-lpPrice", lptokenprice);
          const lptokenprice = 2779309934.5944816;
          
        //******************************** Refferal ****************************************//
        // const referrerNum =  await stakingContract.totalReferrerNum();
        // const referrerRewards = (await stakingContract.totalReferrerRewards())/ Math.pow(10, 5);
        // console.log("App-referrerNum",referrerNum);
        // console.log("App-referrerRewards", referrerRewards);
        const referrerNum = 6;
        const referrerRewards = 9.605;

        return {
            totalSupply: totalSupply,
            marketCap: marketCap,
            currentBlock: currentBlock ,
            dailyRate: dailyRate,
            circSupply: circSupply,
            fiveDayRate: fiveDayRate,
            marketPrice: marketPrice,
            currentBlockTime: currentBlockTime,
            oneDayRate: oneDayRate,
            lastRebasedTime: lastRebasedTime,
            backedLiquidity: backedLiquidity,
            bnbLiquidityValue: bnbLiquidityValue,
            sifValue: sifValue,
            firepitBalance: firepitBalance,
            treasuryValue: treasuryValue,
            currentApy: currentApy,

            referrerNum: referrerNum,
            referrerRewards: referrerRewards,

            TotalLP: totalLPInPool,
            LPPrice: lptokenprice,

        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    networkID: number;
    totalSupply: number;
    marketCap: number;
    currentBlock: number;
    circSupply: number;
    oneDayRate: number;
    fiveDayRate: number;
    dailyRate:number
    currentBlockTime: number;
    lastRebasedTime: number;
    treasuryValue: number;
    sifValue: number;
    firepitBalance:number;
    bnbLiquidityValue: number;
    backedLiquidity: string;
    marketPrice: number;
    currentApy: number;

    referrerNum: number;
    referrerRewards: number;

    TotalLP: number;
    LPPrice: number;

}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                console.log("app load fullfilled");
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

const baseInfo = (state: RootState) => state.app;

export const getAppState = createSelector(baseInfo, app => app);
