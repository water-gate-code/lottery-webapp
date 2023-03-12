import { useState, useContext } from "react";

import { eventEmitter, Events } from "../../event";
import { connectWallet } from "../../utils";
import { playGame, getGameName, GameIcon } from "..";
import { WalletContext } from "../../WalletContext";
import { Address } from "../../components/Address";

function GameForm({ game, onSubmit }) {
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
  const { accounts, chainId } = useContext(WalletContext);

  const [playing, setPlaying] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setPlaying(true);
    try {
      const amount = game.betAmount.toString();

      if (accounts.length < 1) {
        await connectWallet();
      }
      const receipt = await playGame(
        chainId,
        amount,
        game.id,
        game.player1BetNumber === 6 ? 1 : 6
      );

      eventEmitter.dispatch(Events.COMPLETE_GAME, receipt);
    } catch (error) {
      console.error(error);
    }
    setPlaying(false);
  }

  if (playing) return <div>Playing...</div>;
  return <GameForm game={game} onSubmit={onSubmit} />;
}
