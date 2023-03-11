import { CASINO } from "./contracts";

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
  [DICE_GAME_TYPE]: <i class="bi bi-dice-5-fill"></i>,
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: <i className="bi bi-scissors"></i>,
};

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
  const { contract } = getContractAndProviderByRpc(CASINO);
  const games = await contract.getGames();
  return games.map(gameToDice);
}

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract } = getContractAndProvider(CASINO);
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
    JSON.stringify(transactionResponse)
  );
  const transactionReceipt = await transactionResponse.wait(0);

  console.log(
    "payMoneyAndCreateGame Succeed, transactionReceipt is: ",
    JSON.stringify(transactionReceipt)
  );
};

export const payMoneyAndCreateGameRps = async (amount, selection) => {
  const { contract } = getContractAndProvider(CASINO);
  const betNumber = selection === "Rock" ? 1 : selection === "Paper" ? 2 : 3;
  console.log({
    gameType: ROCK_PAPER_SCISSORS_GAME_TYPE,
    betNumber,
  });
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

export const payMoneyAndShootRps = async (amount, diceId, selection) => {
  const { contract } = getContractAndProvider(CASINO);
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
