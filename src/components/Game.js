import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { getGames, payMoneyAndShoot, connectWallet } from "../utils";
import { WalletContext } from "../WalletContext";

export function Game() {
  let { gameId } = useParams();
  const wallet = useContext(WalletContext);

  const [game, setGame] = useState(null);

  useEffect(() => {
    getGames().then((games) => setGame(games.find((g) => g.id == gameId)));
  }, [gameId]);

  if (!game) {
    return null;
  }
  async function play() {
    const amount = game.betAmount.toString();
    const selection = game.player1BetNumber < 6 ? "big" : "small";
    if (wallet.accounts.length < 1) {
      await connectWallet();
    }
    const response = await payMoneyAndShoot(amount, game.id, selection);
    eventEmitter.dispatch(Events.COMPLETE_GAME, response);
  }

  function onSubmit(e) {
    e.preventDefault();
    play();
  }

  return (
    <div className="container">
      {/* <div>
        <pre>{JSON.stringify(wallet, null, " ")}</pre>
      </div> */}
      <div className="row">
        <div className="col">
          <h1 className="display-1">Play Game: {game.id}</h1>
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
