import { useState, useContext } from "react";

import { eventEmitter, Events } from "../../event";

import { connectWallet } from "../../utils";
import { playGame, getGameName, GameIcon } from "..";
import { WalletContext } from "../../WalletContext";
import { Address } from "../../components/Address";

const SELLECTION = ["Rock", "Paper", "Scissors"];

function GameForm({ game, onSubmit }) {
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
          <p className="lead">Amount: {game.betAmount} ETH</p>
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
                  <a
                    key={sellection}
                    className={
                      "btn btn-outline-primary " +
                      (index + 1 == betSelection ? "active" : "") +
                      " px-4"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setBetSelection(index + 1);
                    }}
                  >
                    {sellection}
                  </a>
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

export function Game({ game }) {
  const { accounts, chainId } = useContext(WalletContext);

  const [playing, setPlaying] = useState(false);

  async function onSubmit(selection) {
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      if (accounts.length < 1) {
        await connectWallet();
      }
      const receipt = await playGame(chainId, amount, game.id, selection);
      eventEmitter.dispatch(Events.COMPLETE_GAME, receipt);
    } catch (error) {
      console.error(error);
    }
    setPlaying(false);
  }

  if (playing) return <div>Playing...</div>;
  return <GameForm game={game} onSubmit={onSubmit} />;
}
