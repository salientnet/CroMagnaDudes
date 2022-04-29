import Web3 from "web3";
import nftABI from "../contracts/abis/nft.json";
const NFTAddress = "0x982e8808Ce05A7b3187dd64aFA0CED48E10804Ab";

export const web3Instance = new Web3("https://evm.cronos.org");

export const contract = new web3Instance.eth.Contract(
  nftABI as any,
  NFTAddress
);

export const balanceOf = (address: string) => {
  return contract.methods.balanceOf(address).call();
};

export const totalSupply = () => {
  return contract.methods.totalSupply().call();
};

export const tokenURI = (tokenId: number) => {
  return contract.methods.tokenURI(tokenId).call();
};

export const getMintPrice = () => {
  return contract.methods.getMintPrice().call();
};

export const mint = (address: string, amount: any, quantity: number) => {
  return contract.methods
    .mintMany(quantity)
    .send({ from: address, value: amount });
};

export const tokenOfOwnerByIndex = (owner: string, index: number) => {
  return contract.methods.tokenOfOwnerByIndex(owner, index).call();
};
