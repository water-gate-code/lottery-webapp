import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { getGames, payMoneyAndShoot } from "../utils";

async function play(amount, diceId, selection) {
  const response = await payMoneyAndShoot(amount, diceId, selection);
  // eventEmitter.dispatch(Events.CREATE_GAME, response);
  eventEmitter.dispatch(Events.COMPLETE_GAME, response);
}

export function Game() {
  let { gameId } = useParams();

  const [game, setGame] = useState(null);

  useEffect(() => {
    getGames().then((games) => setGame(games.find((g) => g.id == gameId)));
  }, [gameId]);

  if (!game) {
    return null;
  }

  function onSubmit(e) {
    e.preventDefault();
    play(
      game.betAmount.toString(),
      game.id,
      game.player1BetNumber < 6 ? "big" : "small"
    );
  }

  return (
    <div className="container">
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
