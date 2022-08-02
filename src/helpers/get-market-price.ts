import { CloseOutlined } from "@material-ui/icons";
import { Console } from "console";
import { ethers } from "ethers";
import { LpReserveContract } from "src/abi";
import { Networks, getAddresses } from "../constants";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairContract = new ethers.Contract(addresses.PAIR_ADDRESS, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0]  / reserves[1];
    // return marketPrice/Math.pow(10,13);
    return 0.05;
}
