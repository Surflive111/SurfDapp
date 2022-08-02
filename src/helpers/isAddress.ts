import { getAddress as getEthAddress } from "@ethersproject/address";

export const isAddress = (value: string) => {
  try {
    return getEthAddress(value);
  } catch {
    return false;
  }
};
