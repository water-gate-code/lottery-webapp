import { chains } from "../chains";
import { CreateGame as CreateGameDice } from "./Dice/CreateGame";
import { CreateGame as CreateGameRps } from "./RockPaperScissors/CreateGame";
import { Game as GameDice } from "./Dice/GameDice";
import { Game as GameRps } from "./RockPaperScissors/GameRps";

const { ethers } = window;
const { ethereum } = window;

export const DICE_GAME_TYPE = 1; // 掷骰子
export const ROCK_PAPER_SCISSORS_GAME_TYPE = 2; // 石头剪刀布
export const GAME_TYPES = [DICE_GAME_TYPE, ROCK_PAPER_SCISSORS_GAME_TYPE];

export const getGameName = (gameType) => {
  switch (gameType) {
    case DICE_GAME_TYPE:
      return "Dice";
    case ROCK_PAPER_SCISSORS_GAME_TYPE:
      return "Rock Paper Scissors";
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameIcon = ({ gameType }) => {
  switch (gameType) {
    case DICE_GAME_TYPE:
      return <i className="bi bi-dice-5-fill"></i>;
    case ROCK_PAPER_SCISSORS_GAME_TYPE:
      return <i className="bi bi-scissors"></i>;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const CreateGameRenderer = ({ gameType }) => {
  switch (gameType) {
    case DICE_GAME_TYPE:
      return <CreateGameDice />;
    case ROCK_PAPER_SCISSORS_GAME_TYPE:
      return <CreateGameRps />;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameRenderer = ({ game }) => {
  switch (game.type) {
    case DICE_GAME_TYPE:
      return <GameDice game={game} />;
    case ROCK_PAPER_SCISSORS_GAME_TYPE:
      return <GameRps game={game} />;
    default:
      throw new Error(`Invalid Game Type (type="${game.type}")`);
  }
};

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
  return games.map(formatGame);
}
export async function getGame(chainId, gameId) {
  if (!chainId) return null;
  const game = await casino(chainId, true).contract.getGame(gameId);
  return formatGame(game);
}
export const createGame = async (chainId, amount, gameType, bet) => {
  const { contract } = casino(chainId);

  const response = await contract.createGame(gameType, bet, {
    value: ethers.utils.parseEther(amount),
  });
  // ask Satoru why pass 0 here?
  // const receipt = await response.wait(0);
  const receipt = await response.wait();
  return receipt;
};
export const playGame = async (chainId, amount, gameId, bet) => {
  const { contract } = casino(chainId);

  const response = await contract.playGame(gameId, bet, {
    value: ethers.utils.parseEther(amount),
  });
  // ask Satoru why pass 0 here?
  // const receipt = await response.wait(0);
  const receipt = await response.wait();
  return receipt;
};

const formatGame = (game) => {
  const { id, gameType, wager, gamblers } = game;

  return {
    id: id.toString(),
    type: parseInt(gameType.toString()),
    player1: gamblers[0].id.toString(),
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].bet.toString(),
    isActive: gamblers.length < 2,
  };
};
