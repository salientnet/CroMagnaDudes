import Web3 from "web3";

import { NFT_TYPE } from "./types";
import nftABI from "../contracts/abis/nft.json";

const NFT_ADDRESS: any = {
  [NFT_TYPE.TIER_1]: "0x982e8808Ce05A7b3187dd64aFA0CED48E10804Ab",
  [NFT_TYPE.TIER_2]: "0xCc8EAf79434ba65413435dcBC5c3F9a1A02AC33f",
  [NFT_TYPE.TIER_3]: "0x1Cb94F2840FeB8E8DcC72f313850301319597C58",
};

export const web3Instance = new Web3("https://evm.cronos.org");

export const balanceOf = (address: string, type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.balanceOf(address).call();
};

export const totalSupply = (type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.totalSupply().call();
};

export const tokenURI = (tokenId: number, type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.tokenURI(tokenId).call();
};

export const getMintPrice = (type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.getMintPrice().call();
};

export const mint = (
  address: string,
  amount: any,
  quantity: number,
  type: NFT_TYPE
) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods
    .mintMany(quantity)
    .send({ from: address, value: amount });
};

export const tokenOfOwnerByIndex = (
  owner: string,
  index: number,
  type: NFT_TYPE
) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.tokenOfOwnerByIndex(owner, index).call();
};

export const getReflectionBalances = (address: string, type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.getReflectionBalances().call({ from: address });
};

export const claimRewards = (address: string, type: NFT_TYPE) => {
  const contract = new web3Instance.eth.Contract(
    nftABI as any,
    NFT_ADDRESS[type]
  );

  return contract.methods.claimRewards().send({ from: address });
};
