import { DICE } from "./contracts";

const { ethereum } = window;
const { ethers } = window;

export const ethRequest = async (args) => {
  const response = await ethereum.request(args);
  console.info(`[ethereum.request] ${args.method}:`, response);
  return response;
};

export async function connectWallet() {
  return await ethRequest({ method: "eth_requestAccounts" });
}
export async function getAccounts() {
  return await ethRequest({ method: "eth_accounts" });
}
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

function getContractAndProviderByRpc(contractMeta) {
  const provider = new ethers.providers.JsonRpcProvider(contractMeta.RpcUrl);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractMeta.address,
    contractMeta.abi,
    signer
  );

  return { contract, provider };
}

function getContractAndProvider(contractMeta) {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractMeta.address,
    contractMeta.abi,
    signer
  );
  return { contract, provider };
}
export async function getGames() {
  const { contract } = getContractAndProviderByRpc(DICE);
  const games = await contract.getGames();
  return games.map(gameToDice);
}

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract } = getContractAndProvider(DICE);
  const betNumber = selection === "big" ? 6 : 1;

  const transactionResponse = await contract.createGame(betNumber, {
    value: ethers.utils.parseEther(amount),
  });

  console.log(
    "payMoneyAndCreateGame Succeed, transactionResponse is: ",
    JSON.stringify(transactionResponse)
  );
  const transactionReceipt = await transactionResponse.wait(0);

  console.log(
    "payMoneyAndCreateGame Succeed, transactionReceipt is: ",
    JSON.stringify(transactionReceipt)
  );
};

export const payMoneyAndShoot = async (amount, diceId, selection) => {
  const betNumber = selection === "big" ? 6 : 1;

  const { contract } = getContractAndProvider(DICE);
  const transactionResponse = await contract.play(diceId, betNumber, {
    value: ethers.utils.parseEther(amount),
  });

  console.log(
    "payMoneyAndCreateGame Succeed, transactionResponse is: ",
    JSON.stringify(transactionResponse)
  );

  const transactionReceipt = await transactionResponse.wait();

  console.log(
    "payMoneyAndShoot Succeed, transactionReceipt is: ",
    JSON.stringify(transactionReceipt)
  );
};

const gameToDice = (game) => {
  const [id, player1, player2, betAmount, player1BetNumber, player2BetNumber] =
    game;
  return {
    id: id.toString(),
    player1: player1.toString(),
    player2: player2.toString(),
    betAmount: ethers.utils.formatEther(betAmount),
    player1BetNumber: player1BetNumber.toString(),
    player2BetNumber: player2BetNumber.toString(),
  };
};
