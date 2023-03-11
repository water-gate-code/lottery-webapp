import { CASINO } from "./contracts";
import { chains } from "./chains";

const { ethereum } = window;
const { ethers } = window;

const NULL_PLAYER = "0x0000000000000000000000000000000000000000";
export const DICE_GAME_TYPE = 1; // 掷骰子
export const ROCK_PAPER_SCISSORS_GAME_TYPE = 2; // 石头剪刀布
export const GAME_TYPES = [DICE_GAME_TYPE, ROCK_PAPER_SCISSORS_GAME_TYPE];
export const GAME_NAMES = {
  [DICE_GAME_TYPE]: "Dice",
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: "Rock Paper Scissor",
};
export const GAME_ICONS = {
  [DICE_GAME_TYPE]: <i className="bi bi-dice-5-fill"></i>,
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: <i className="bi bi-scissors"></i>,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

function casino(chainId, isReadOnly) {
  const chain = chains[chainId];
  const contractMeta = chain.contracts.Casino;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const contract = new ethers.Contract(
    contractMeta.address,
    contractMeta.abi,
    isReadOnly ? provider : provider.getSigner()
  );
  return { contract, provider };
}

export async function getGames(chainId) {
  if (!chainId) return [];
  const games = await casino(chainId, true).contract.getGames();
  return games.map(gameToDice);
}

export const payMoneyAndCreateGame = async (chainId, amount, selection) => {
  const { contract } = casino(chainId);
  const betNumber = selection === "Big" ? 6 : 1;

  const transactionResponse = await contract.createGame(
    DICE_GAME_TYPE,
    betNumber,
    {
      value: ethers.utils.parseEther(amount),
    }
  );

  console.log(
    "payMoneyAndCreateGame Succeed, transactionResponse is: ",
    transactionResponse
  );
  // ask Satoru why pass 0 here?
  // const transactionReceipt = await transactionResponse.wait(0);
  const transactionReceipt = await transactionResponse.wait();

  console.log(
    "payMoneyAndCreateGame Succeed, transactionReceipt is: ",
    transactionReceipt
  );
};

export const payMoneyAndCreateGameRps = async (chainId, amount, selection) => {
  const { contract } = casino(chainId);
  const betNumber = selection === "Rock" ? 1 : selection === "Paper" ? 2 : 3;

  const transactionResponse = await contract.createGame(
    ROCK_PAPER_SCISSORS_GAME_TYPE,
    betNumber,
    {
      value: ethers.utils.parseEther(amount),
    }
  );

  console.log(
    "payMoneyAndCreateGame Succeed, transactionResponse is: ",
    JSON.stringify(transactionResponse)
  );
  const transactionReceipt = await transactionResponse.wait();

  console.log(
    "payMoneyAndCreateGame Succeed, transactionReceipt is: ",
    JSON.stringify(transactionReceipt)
  );
};

export const payMoneyAndShoot = async (chainId, amount, diceId, selection) => {
  const betNumber = selection === "big" ? 6 : 1;

  const { contract } = casino(chainId);
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

export const payMoneyAndShootRps = async (
  chainId,
  amount,
  diceId,
  selection
) => {
  const { contract } = casino(chainId);
  const transactionResponse = await contract.playGame(diceId, selection, {
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
  const { id, gameType, wager, gamblers } = game;

  return {
    id: id.toString(),
    type: parseInt(gameType.toString()),
    player1: gamblers[0].id.toString(),
    player2: gamblers.length > 1 ? gamblers[1].id.toString() : NULL_PLAYER,
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].bet.toString(),
    isActive: gamblers.length < 2,
  };
};

export const formatAddress = (address) => {
  const begin = address.substr(0, 4);
  const end = address.substr(address.length - 4, 4);
  return begin + "•••" + end;
};
