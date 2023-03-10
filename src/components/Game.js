import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { getGames, payMoneyAndShoot, connectWallet } from "../utils";
import { WalletContext } from "../WalletContext";

function GameForm({ game, onSubmit }) {
  return (
    <div className="container">
      {/* <div>
        <pre>{JSON.stringify(wallet, null, " ")}</pre>
      </div> */}
      <div className="row">
        <div className="col">
          <p className="lead">Play Game: {game.id}</p>
          <p className="lead">Amount: {game.betAmount} ETH</p>
          <p className="lead">Player: {game.player1}</p>
          <p className="lead">
            On: {game.player1BetNumber < 6 ? "small" : "big"}
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

  async function onSubmit(e) {
    e.preventDefault();
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();
      const selection = game.player1BetNumber < 6 ? "big" : "small";
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
