import { chains } from "../chains";
import { CreateGame as CreateGameDice } from "./Dice/CreateGame";
import { CreateGame as CreateGameRps } from "./RockPaperScissors/CreateGame";
import { Game as GameDice } from "./Dice/GameDice";
import { Game as GameRps } from "./RockPaperScissors/GameRps";

const { ethers } = window;
const { ethereum } = window;

const CreateGame_Event = "CreateGame_Event";
const CompleteGame_Event = "CompleteGame_Event";

export const GameType = {
  Dice: 1,
  Rps: 2,
};

export const getGameName = (gameType) => {
  switch (gameType) {
    case GameType.Dice:
      return "Dice";
    case GameType.Rps:
      return "Rock Paper Scissors";
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameIcon = ({ gameType }) => {
  switch (gameType) {
    case GameType.Dice:
      return <i className="bi bi-dice-5-fill"></i>;
    case GameType.Rps:
      return <i className="bi bi-scissors"></i>;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const CreateGameRenderer = ({ gameType }) => {
  switch (gameType) {
    case GameType.Dice:
      return <CreateGameDice />;
    case GameType.Rps:
      return <CreateGameRps />;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameRenderer = ({ game }) => {
  switch (game.type) {
    case GameType.Dice:
      return <GameDice game={game} />;
    case GameType.Rps:
      return <GameRps game={game} />;
    default:
      throw new Error(`Invalid Game Type (type="${game.type}")`);
  }
};

const casino = (function () {
  const cache = {};
  return function casino(chainId, isReadOnly) {
    const cacheKey = `${chainId}-${isReadOnly ? 1 : 0}`;
    if (!cache[cacheKey]) {
      const chain = chains[chainId];
      const casinoMeta = chain.contracts.Casino;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(
        casinoMeta.address,
        casinoMeta.abi,
        isReadOnly ? provider : provider.getSigner()
      );
      cache[cacheKey] = { contract, provider };
    }

    return cache[cacheKey];
  };
})();

function createGameListener(game, event) {
  console.log("[event]: CreateGame_Event", { game, event });
}

export function onCreateGame() {
  casino(1337, true).contract.on("CreateGame_Event", createGameListener);
}
export function offCreateGame() {
  casino(1337, true).contract.off("CreateGame_Event", createGameListener);
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
  const receipt = await response.wait();
  const { events } = receipt;

  const createGameEvent = events.find((e) => e.event === CreateGame_Event);

  return formatGame(createGameEvent.args.game);
};
export const playGame = async (chainId, amount, gameId, bet) => {
  const { contract } = casino(chainId);

  const response = await contract.playGame(gameId, bet, {
    value: ethers.utils.parseEther(amount),
  });

  const receipt = await response.wait();
  const { events } = receipt;

  const completeGameEvent = events.find((e) => e.event === CompleteGame_Event);

  return completeGameEvent.args.winner;
};

const formatGame = (game) => {
  const { id, gameType, wager, gamblers } = game;

  return {
    id: id.toString(),
    type: parseInt(gameType.toString()),
    player1: gamblers[0].id.toString(),
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].choice.toString(),
    isActive: gamblers.length < 2,
  };
};
