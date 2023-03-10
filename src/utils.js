import { CASINO } from "./contracts";

const { ethereum } = window;
const { ethers } = window;

const DICE_GAME_TYPE = 1; // 掷骰子
const ROCK_PAPER_SCISSORS_GAME_TYPE = 2; // 石头剪刀布

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  await delay(1000);
  const { contract } = getContractAndProviderByRpc(CASINO);
  const games = await contract.getGames();
  return games.map(gameToDice);
}

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract } = getContractAndProvider(CASINO);
  const betNumber = selection === "big" ? 6 : 1;

  const transactionResponse = await contract.createGame(
    DICE_GAME_TYPE,
    betNumber,
    {
      value: ethers.utils.parseEther(amount),
    }
  );

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

  const { contract } = getContractAndProvider(CASINO);
  const transactionResponse = await contract.playGame(diceId, betNumber, {
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
  const { id, wager, gamblers } = game;
  return {
    id: id.toString(),
    player1: gamblers[0].id.toString(),
    player2: gamblers.length > 1 ? gamblers[1].id.toString() : NULL_PLAYER,
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].bet.toString(),
    isActive: gamblers.length < 2,
  };
};

const NULL_PLAYER = "0x0000000000000000000000000000000000000000";
