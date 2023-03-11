import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import {
  getGames,
  payMoneyAndShoot,
  connectWallet,
  GAME_NAMES,
  GAME_ICONS,
} from "../utils";
import { WalletContext } from "../WalletContext";
import { Address } from "./Address";

const SELLECTION = ["Rock", "Paper", "Scissors"];

function GameForm({ game, onSubmit }) {
  const [betSelection, setBetSelection] = useState(1);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6">
            {GAME_ICONS[game.type]}&nbsp;&nbsp;
            {GAME_NAMES[game.type]}
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

export function Game() {
  let { gameId } = useParams();
  const wallet = useContext(WalletContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGames().then((games) => {
      setGame(games.find((g) => g.id == gameId));
      setLoading(false);
    });
  }, [gameId]);

  async function onSubmit(selection) {
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      if (wallet.accounts.length < 1) {
        await connectWallet();
      }
      const response = await payMoneyAndShoot(amount, game.id, selection);
      eventEmitter.dispatch(Events.COMPLETE_GAME, response);
    } catch (error) {
      console.error(error);
    }
    setPlaying(false);
  }

  if (loading) return <div>Loading...</div>;
  if (playing) return <div>Playing...</div>;
  if (!game) return <div>Game not found!</div>;
  return <GameForm game={game} onSubmit={onSubmit} />;
}
