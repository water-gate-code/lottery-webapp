import { useState, useEffect } from "react";

import { connectWallet } from "../../utils/wallet";

import { selectCasino, selectChain } from "../../store/slices/chain";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser, updateBalance } from "../../store/slices/user";
import { Game, GameResult, GameType, parseGameType } from "../../utils/casino";
import { useParams } from "react-router-dom";
import { selectGame } from "../../store/slices/game";
import { GamePlayData, GameWindow } from "./GameWindow";

export enum GamePlayStatus {
  idle,
  creating,
  waitingResult,
  finished,
}

interface GamePlayIdle {
  status: GamePlayStatus.idle;
}

interface GamePlayCreating {
  status: GamePlayStatus.creating;
}

interface GamePlayWaitingResult {
  status: GamePlayStatus.waitingResult;
  game: Game;
}

interface GamePlayFinished {
  status: GamePlayStatus.finished;
  game: Game;
  result: GameResult;
}

export type GamePlayState =
  | GamePlayIdle
  | GamePlayCreating
  | GamePlayWaitingResult
  | GamePlayFinished;

export function GamePlay() {
  const { gameType: gameTypeKey } = useParams();
  if (gameTypeKey === undefined) throw new Error("Invalid game type");
  const gameType = parseGameType(gameTypeKey);
  const dispatch = useAppDispatch();
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const { gameResults } = useAppSelector(selectGame);
  if (chain.id === null || !chain.support) {
    throw new Error("Invalid chain");
  }

  const [gamePlay, setGamePlay] = useState<GamePlayState>({
    status: GamePlayStatus.finished,
    result: GameResult.draw,
    game: {
      id: "",
      type: GameType.dice,
      players: [],
    },
  });

  useEffect(() => {
    if (gamePlay.status === GamePlayStatus.waitingResult) {
      const result = gameResults[gamePlay.game.id];
      if (result !== undefined) {
        setGamePlay({
          ...gamePlay,
          status: GamePlayStatus.finished,
          result,
        });
        if (user.authed) {
          dispatch(updateBalance(user.address));
        }
      }
    }
  }, [gameResults, gamePlay, user, dispatch]);

  async function play(gamePlayData: GamePlayData) {
    try {
      if (!user.authed) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      setGamePlay({
        status: GamePlayStatus.creating,
      });

      const { wager, type, choice } = gamePlayData;
      const game = await casino.playGameWithDefaultHost(wager, type, choice);

      if (user.authed) {
        dispatch(updateBalance(user.address));
      }
      setGamePlay({
        ...gamePlay,
        status: GamePlayStatus.waitingResult,
        game,
      });
    } catch (error) {
      setGamePlay({
        status: GamePlayStatus.idle,
      });
      throw error;
    }
  }

  if (gamePlay.status === GamePlayStatus.finished) {
    setTimeout(() => {
      setGamePlay({
        status: GamePlayStatus.idle,
      });
    }, 3000);
  }
  return (
    <div className="col-8 offset-2">
      <div className="row">
        <div className="col mt-5">
          <GameWindow
            nativeMinScale={chain.config.nativeMinScale}
            currency={chain.info.nativeCurrency.symbol}
            gameType={gameType}
            gamePlayState={gamePlay}
            onPlay={play}
          />
        </div>
      </div>
    </div>
  );
}
