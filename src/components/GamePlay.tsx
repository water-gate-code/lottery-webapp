import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { connectWallet } from "../utils/wallet";

import { selectCasino, selectChain } from "../store/slices/chain";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUser, updateBalance } from "../store/slices/user";
import {
  Game,
  GameResult,
  GameType,
  getGameChioce,
  getGameNameKey,
  parseGameType,
} from "../utils/casino";
import { useParams } from "react-router-dom";
import { selectGame } from "../store/slices/game";

enum GamePlayStatus {
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

type GamePlayState =
  | GamePlayIdle
  | GamePlayCreating
  | GamePlayWaitingResult
  | GamePlayFinished;

export function GamePlay() {
  const { t } = useTranslation();
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

  const currency = chain.info.nativeCurrency.symbol;
  const amountScales = [1, 2, 5, 8, 10].map((n) =>
    (n * chain.config.nativeMinScale).toString()
  );
  const [wager, setWager] = useState(amountScales[0]);

  const choices = getGameChioce(gameType);
  const [choice, setChoice] = useState(choices[Object.keys(choices)[0]]);

  const [gamePlay, setGamePlay] = useState<GamePlayState>({
    status: GamePlayStatus.idle,
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

  async function create() {
    if (!user.authed) {
      await connectWallet();
    }
    if (casino === null) {
      throw new Error("Contract not exist");
    }
    setGamePlay({
      status: GamePlayStatus.creating,
    });

    const type = GameType.dice;
    const game = await casino.playGameWithDefaultHost(wager, type, choice);

    if (user.authed) {
      dispatch(updateBalance(user.address));
    }
    setGamePlay({
      ...gamePlay,
      status: GamePlayStatus.waitingResult,
      game,
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create();
  }
  if (gamePlay.status === GamePlayStatus.creating)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
        <div>creating</div>
      </div>
    );
  if (gamePlay.status === GamePlayStatus.waitingResult)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
        <div>waitingResult {gamePlay.game.id}</div>
      </div>
    );
  if (gamePlay.status === GamePlayStatus.finished)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
        <div>
          finished {gamePlay.game.id}: {gamePlay.result}
        </div>
      </div>
    );

  return (
    <div className="col-8 offset-2">
      <div className="row">
        <div className="col">
          <h6 className="display-6 mt-3 mb-5">
            {t("game.createTitle", {
              gameName: t(getGameNameKey(gameType)),
            })}
          </h6>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <div className="btn-group">
                {amountScales.map((amount) => (
                  <button
                    key={amount}
                    className={
                      "btn btn-outline-primary " +
                      (amount === wager ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={() => setWager(amount)}
                  >
                    {`${amount} ${currency}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="btn-group">
                {Object.keys(choices).map((c) => (
                  <button
                    key={c}
                    className={
                      "btn btn-outline-primary " +
                      (choice === choices[c] ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={(e) => {
                      setChoice(choices[c]);
                    }}
                  >
                    {t(`game.${gameTypeKey}.choice.${c}`)}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {t("game.create")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
