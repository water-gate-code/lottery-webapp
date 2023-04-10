import { useState } from "react";
import { useTranslation } from "react-i18next";

import { connectWallet } from "../../../utils/wallet";
import { GameIcon } from "..";
import { Address } from "../../Address";
import { useAppSelector } from "../../../hooks";
import { selectCasino, selectChain } from "../../../store/slices/chain";
import { selectUser } from "../../../store/slices/user";
import { Game as IGame, getGameNameKey } from "../../../utils/casino";

const Choice = ["rock", "paper", "scissors"];

function GameForm({
  game,
  currencySymbol,
  onSubmit,
}: {
  game: IGame;
  currencySymbol: string;
  onSubmit: (selection: number) => void;
}) {
  const { t } = useTranslation();
  const [betSelection, setBetSelection] = useState(1);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6">
            <GameIcon gameType={game.type} />
            &nbsp;&nbsp;
            {t(getGameNameKey(game.type))}
          </h6>
          <p className="lead">
            {t("game.gameId")}: <Address address={game.id} />
          </p>
          <p className="lead">
            {t("game.player")}: <Address address={game.player1} />
          </p>
          <p className="lead">
            {t("game.amount")}: {game.betAmount} {currencySymbol}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(betSelection);
            }}
          >
            <div className="mb-3">
              <div className="btn-group">
                {Choice.map((choice, index) => (
                  <button
                    key={choice}
                    className={
                      "btn btn-outline-primary " +
                      (index + 1 === betSelection ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={() => setBetSelection(index + 1)}
                  >
                    {t(`game.rps.choice.${choice}`)}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {t("game.play")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Game({ game }: { game: IGame }) {
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;
  if (!supportChain) {
    throw new Error("Invalid chain");
  }
  const currencySymbol = chain.info.nativeCurrency.symbol;

  const [playing, setPlaying] = useState(false);

  async function onSubmit(selection: number) {
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      if (!user.authed) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      await casino.playGame(amount, game.id, selection);
    } catch (error) {
      setPlaying(false);
      throw error;
    }
  }

  if (playing)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  return (
    <GameForm game={game} currencySymbol={currencySymbol} onSubmit={onSubmit} />
  );
}
