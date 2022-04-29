import Web3 from "web3";

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const minimizeAddress = (address: string) => {
  return address.substr(0, 4) + "..." + address.substr(-4, 4);
};

export const fromWei = (wei: any, unit: any = "ether") => {
  return Web3.utils.fromWei(wei, unit);
};

export const toWei = (amount: any, unit: any = "ether") => {
  return Web3.utils.toWei(amount, unit);
};
