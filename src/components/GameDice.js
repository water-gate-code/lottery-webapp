import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import {
  getGame,
  payMoneyAndShoot,
  connectWallet,
  GAME_NAMES,
  GAME_ICONS,
} from "../utils";
import { WalletContext } from "../WalletContext";
import { Address } from "./Address";

function GameForm({ game, onSubmit }) {
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

export function Game() {
  let { gameId } = useParams();
  const { accounts, chainId } = useContext(WalletContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGame(chainId, gameId).then((game) => {
      setGame(game);
      setLoading(false);
    });
  }, [gameId, chainId]);

  async function onSubmit(e) {
    e.preventDefault();
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      const selection = game.player1BetNumber < 6 ? "big" : "small";
      if (accounts.length < 1) {
        await connectWallet();
      }
      const response = await payMoneyAndShoot(
        chainId,
        amount,
        game.id,
        selection
      );
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
