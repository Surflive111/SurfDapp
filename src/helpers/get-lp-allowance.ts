import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { LpReserveContract } from "src/abi";
import { getAddresses, Networks } from "src/constants"

export const getApprovedLPAmount = async (address: string, networkID: Networks, provider: JsonRpcProvider| StaticJsonRpcProvider): Promise<number> => {
    const addresses = getAddresses(networkID);
    const lpReserveContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, provider);
    let allowance = 0;
    allowance = lpReserveContract.allowance(address, addresses.STAKING_ADDRESS);
    return allowance;
}