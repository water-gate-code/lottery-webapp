const { ethereum } = window;
const { ethers } = window;

export const ethRequest = async (args) => {
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
export async function getAccounts() {
  return await ethRequest({ method: "eth_accounts" });
}
export async function getBalance(account) {
  const balance = await ethRequest({
    method: "eth_getBalance",
    params: [account, "latest"],
  });
  return ethers.utils.formatEther(balance);
}
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

export async function switchNetwork(chainId) {
  return await ethRequest({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toHex(chainId) }],
  });
}

export async function addToNetwork({ address, chain, rpc }) {
  if (!address) {
    await connectWallet();
  }

  const params = {
    chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: rpc ? [rpc] : chain.rpc.map((r) => r?.url ?? r),
    blockExplorerUrls: [
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? chain.explorers[0].url
        : chain.infoURL,
    ],
  };

  const result = await ethRequest({
    method: "wallet_addEthereumChain",
    params: [params, address],
  });

  return result;
}

export const toHex = (num) => "0x" + num.toString(16);

export const formatAddress = (address) => {
  const begin = address.substr(0, 4);
  const end = address.substr(address.length - 4, 4);
  return begin + "•••" + end;
};
