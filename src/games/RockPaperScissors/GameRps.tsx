import { useState, useContext } from "react";

import { eventEmitter, Events } from "../../event";

import { connectWallet } from "../../utils";
import { getGameName, GameIcon } from "..";
import { WalletContext } from "../../contexts/WalletContext";
import { Address } from "../../components/Address";

const SELLECTION = ["Rock", "Paper", "Scissors"];

function GameForm({ game, currencySymbol, onSubmit }: any) {
  const [betSelection, setBetSelection] = useState(1);
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
                {SELLECTION.map((sellection, index) => (
                  <button
                    key={sellection}
                    className={
                      "btn btn-outline-primary " +
                      (index + 1 === betSelection ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={() => setBetSelection(index + 1)}
                  >
                    {sellection}
                  </button>
                ))}
              </div>
            </div>
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
  const { accounts, casino, chain } = useContext(WalletContext);
  const currencySymbol = chain === null ? "" : chain.info.nativeCurrency.symbol;

  const [playing, setPlaying] = useState(false);

  async function onSubmit(selection: number) {
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      if (accounts.length < 1) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      const receipt = await casino.playGame(amount, game.id, selection);
      const winner = casino.parseWinnerFromEvent(receipt);
      eventEmitter.dispatch(Events.COMPLETE_GAME, winner);
    } catch (error) {
      throw error;
    } finally {
      setPlaying(false);
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
