import { FormEvent, useState } from "react";

import { GameType, getGameChioce } from "../../utils/casino";
import { useTranslation } from "react-i18next";
import { GamePlayState, GamePlayStatus } from ".";

export interface GameBetData {
  wager: string;
  type: GameType;
  choice: number;
}
const AMOUNT_SCALES = [1, 2, 5, 8, 10];

export const GameWindow = ({
  nativeMinScale,
  currency,
  gameType,
  gamePlayState,
  onBet,
}: {
  nativeMinScale: number;
  currency: string;
  gameType: GameType;
  gamePlayState: GamePlayState;
  onBet: (betData: GameBetData) => void;
}) => {
  const choices = getGameChioce(gameType);
  const { t } = useTranslation();
  const [wagerStep, setWagerStep] = useState(0);
  const [choice, setChoice] = useState(choices[Object.keys(choices)[0]]);

  const wager = AMOUNT_SCALES[wagerStep] * nativeMinScale;
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    onBet({ wager: wager.toString(), choice, type: gameType });
  }
  const title = t(`game.${GameType[gameType]}.name`);

  if (gamePlayState.status === GamePlayStatus.creating)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
        <div>creating</div>
      </div>
    );
  if (gamePlayState.status === GamePlayStatus.waitingResult)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
        <div>waitingResult {gamePlayState.game.id}</div>
      </div>
    );
  return (
    <div className="card shadow">
      <div className="card-header">{title}</div>
      <div className="card-body p-0">
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-4 border-end" style={{ minHeight: 100 }}>
              <div className="p-3">
                <label htmlFor="wagerRange" className="form-label">
                  Bet Amount: {wager + " " + currency}
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={AMOUNT_SCALES.length - 1}
                  step="1"
                  id="wagerRange"
                  value={wagerStep}
                  onChange={(e) => {
                    setWagerStep(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="py-0 px-3">
                <button type="submit" className="btn btn-primary">
                  {t("game.play")}
                </button>
              </div>
            </div>
            <div className="col-8 ">
              <div className="p-5">
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
                      onClick={(e) => {
                        setChoice(choices[c]);
                      }}
                    >
                      {t(`game.${GameType[gameType]}.choice.${c}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
