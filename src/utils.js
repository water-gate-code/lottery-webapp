const { ethereum } = window;
const { ethers } = window;

export const ethRequest = async (args) => {
  try {
    const response = await ethereum.request(args);
    console.info(`[ethereum.request] ${args.method}:`, response);
    return response;
  } catch (error) {
    console.error(`[ethereum.request] ${args.method}:`, error);
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

export const formatAddress = (address) => {
  const begin = address.substr(0, 4);
  const end = address.substr(address.length - 4, 4);
  return begin + "•••" + end;
};
