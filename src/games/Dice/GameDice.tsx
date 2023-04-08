import { useState, FormEvent } from "react";

import { connectWallet } from "../../utils/wallet";
import { getGameName, GameIcon } from "..";
import { Address } from "../../components/Address";
import { useAppSelector } from "../../hooks";
import { selectCasino, selectChain } from "../../store/slices/chain";
import { selectUser } from "../../store/slices/user";

function GameForm({ game, currencySymbol, onSubmit }: any) {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6">
            <GameIcon gameType={game.type} />
            &nbsp;&nbsp;
            {getGameName(game.type)}
          </h6>
          <p className="lead">
            Game Id: <Address address={game.id} />
          </p>
          <p className="lead">
            Player: <Address address={game.player1} />
          </p>
          <p className="lead">
            Amount: {game.betAmount} {currencySymbol}
          </p>
          <p className="lead">
            On: {game.player1BetNumber < 6 ? "Small" : "Big"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
            <button type="submit" className="btn btn-primary">
              Play with it
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Game({ game }: any) {
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
      const amount = game.betAmount.toString();

      if (!user.authed) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      await casino.playGame(
        amount,
        game.id,
        game.player1BetNumber === 6 ? 1 : 6
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
