import type { ChainInfo } from "./chains";
import { utils } from "ethers";

const { ethereum } = window;

export const toHex = (num: number) => "0x" + num.toString(16);

export const metamaskInstalled = () => {
  return !!ethereum;
};

export const ethRequest = async (args: any) => {
  try {
    const response = await ethereum.request(args);
    console.info(`[wallet.request]: ${args.method}:`, response);
    return response;
  } catch (error) {
    console.error(`[wallet.request]: ${args.method}:`, error);
    throw error;
  }
};

export async function connectWallet() {
  return await ethRequest({ method: "eth_requestAccounts" });
}
export async function getAccounts(): Promise<string[]> {
  return await ethRequest({ method: "eth_accounts" });
}
export async function getBalance(address: string): Promise<string> {
  const balance = await ethRequest({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return utils.formatEther(balance);
}
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

export async function switchNetwork(chainId: number) {
  return await ethRequest({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toHex(chainId) }],
  });
}

export async function addToNetwork(
  address: string | null,
  chainInfo: ChainInfo
) {
  if (address === null) {
    await connectWallet();
  }

  const params = {
    chainId: toHex(chainInfo.chainId), // A 0x-prefixed hexadecimal string
    chainName: chainInfo.name,
    nativeCurrency: {
      name: chainInfo.nativeCurrency.name,
      symbol: chainInfo.nativeCurrency.symbol, // 2-6 characters long
      decimals: chainInfo.nativeCurrency.decimals,
    },
    rpcUrls: chainInfo.rpc,
    blockExplorerUrls: [
      chainInfo.explorers &&
      chainInfo.explorers.length > 0 &&
      chainInfo.explorers[0].url
        ? chainInfo.explorers[0].url
        : chainInfo.infoURL,
    ],
  };

  const result = await ethRequest({
    method: "wallet_addEthereumChain",
    params: [params, address],
  });

  return result;
}
