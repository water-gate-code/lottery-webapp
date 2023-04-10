import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { connectWallet } from "../../../utils/wallet";
import { GameIcon } from "..";
import { Address } from "../../Address";
import { useAppSelector } from "../../../hooks";
import { selectCasino, selectChain } from "../../../store/slices/chain";
import { selectUser } from "../../../store/slices/user";
import { Game as IGame, getGameNameKey } from "../../../utils/casino";

function GameForm({
  game,
  currencySymbol,
  onSubmit,
}: {
  game: IGame;
  currencySymbol: string;
  onSubmit: (e: FormEvent) => void;
}) {
  const { t } = useTranslation();
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
          <p className="lead">
            {t("game.on")}:{" "}
            {BigInt(game.player1BetNumber) < 6
              ? t("game.dice.choice.small")
              : t("game.dice.choice.big")}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPlaying(true);
    try {
      const amount = game.betAmount;
      if (!user.authed) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      await casino.playGame(
        amount,
        game.id,
        BigInt(game.player1BetNumber) === BigInt(6) ? 1 : 6
      );
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
