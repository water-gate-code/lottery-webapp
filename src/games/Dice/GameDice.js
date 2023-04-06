import { useState, useContext } from "react";

import { connectWallet } from "../../utils";
import { getGameName, GameIcon } from "..";
import { WalletContext } from "../../contexts/WalletContext";
import { Address } from "../../components/Address";

function GameForm({ game, currencySymbol, onSubmit }) {
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

export function Game({ game }) {
  const { accounts, casino, chain } = useContext(WalletContext);
  const currencySymbol = chain.info.nativeCurrency.symbol;
  const [playing, setPlaying] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();

      if (accounts.length < 1) {
        await connectWallet();
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
