import { FormEvent, useState } from "react";

import { GameResult, GameType, getGameChioce } from "../../utils/casino";
import { useTranslation } from "react-i18next";
import { GamePlayState, GamePlayStatus } from ".";

export interface GamePlayData {
  wager: string;
  type: GameType;
  choice: number;
}
const AMOUNT_SCALES = [1, 2, 5, 8, 10];

function Loading({ message }: { message: string }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
      <div className="d-flex justify-content-center">
        <div>{message}</div>
      </div>
    </>
  );
}

export const GameWindow = ({
  nativeMinScale,
  currency,
  gameType,
  gamePlayState,
  onPlay: onBet,
}: {
  nativeMinScale: number;
  currency: string;
  gameType: GameType;
  gamePlayState: GamePlayState;
  onPlay: (gamePlayData: GamePlayData) => void;
}) => {
  const choices = getGameChioce(gameType);
  const isFinished = gamePlayState.status === GamePlayStatus.finished;
  const gamePlaying =
    gamePlayState.status === GamePlayStatus.creating ||
    gamePlayState.status === GamePlayStatus.waitingResult;

  const { t } = useTranslation();
  const [wagerStep, setWagerStep] = useState(0);
  const resultMessage = isFinished
    ? `Result: ${GameResult[gamePlayState.result]}`
    : "";
  const [choice, setChoice] = useState(choices[Object.keys(choices)[0]]);

  const wager = AMOUNT_SCALES[wagerStep] * nativeMinScale;
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!gamePlaying) {
      onBet({ wager: wager.toString(), choice, type: gameType });
    }
  }

  const title = t(`game.${GameType[gameType]}.name`);

  const changeWagerStep = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWagerStep(parseInt(e.target.value));
  };
  const changeChoice = (
    choice: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setChoice(choices[choice]);
  };

  const PlayUI = (
    <>
      <div className="d-flex justify-content-center pb-5">
        <h5 className="display-5">{title}</h5>
      </div>
      <div className="d-flex justify-content-evenly p-3">
        {Object.keys(choices).map((c) => (
          <button
            key={c}
            className={
              "btn btn-outline-primary " +
              (choice === choices[c] ? "active" : "") +
              " px-4"
            }
            type="button"
            onClick={changeChoice.bind(null, c)}
          >
            {t(`game.${GameType[gameType]}.choice.${c}`)}
          </button>
        ))}
      </div>
    </>
  );

  const gameCell = gamePlaying ? (
    <Loading message="Waiting game result..." />
  ) : (
    PlayUI
  );

  return (
    <div className="card shadow">
      <div className="card-header">
        <div className="d-flex justify-content-between">
          <div>{title}</div>
          <div className="text-primary">{resultMessage}</div>
        </div>
      </div>
      <div className="card-body p-0">
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-4 border-end" style={{ minHeight: 100 }}>
              <div className="p-3">
                <div className="d-flex justify-content-between">
                  <label htmlFor="wagerRange" className="form-label">
                    Bet Amount:
                  </label>
                  <label htmlFor="wagerRange" className="form-label">
                    {wager + " " + currency}
                  </label>
                </div>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={AMOUNT_SCALES.length - 1}
                  step="1"
                  id="wagerRange"
                  value={wagerStep}
                  onChange={changeWagerStep}
                />
              </div>
              <div className="py-0 px-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={gamePlaying}
                >
                  {t("game.play")}
                </button>
              </div>
            </div>
            <div className="col-8 ">
              <div className="p-5">{gameCell}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
