import { useState, useContext } from "react";

import { connectWallet } from "../../utils";
import { GameType, getGameName } from "../";
import { eventEmitter, Events } from "../../event";
import { WalletContext } from "../../contexts/WalletContext";

const Option = {
  Small: 1,
  Big: 6,
};

export function CreateGame() {
  const { accounts, casino, chain } = useContext(WalletContext);
  const currency = chain.info.nativeCurrency.symbol;
  const amountScales = [1, 2, 5, 8, 10].map((n) => n * chain.nativeMinScale);
  const [betAmount, setBetAmount] = useState(amountScales[0]);
  const [betSelection, setBetSelection] = useState(Option.Small);
  const [creating, setCreating] = useState(false);

  async function create() {
    setCreating(true);
    try {
      if (accounts.length < 1) {
        await connectWallet();
      }
      const game = await casino.createGame(
        betAmount,
        GameType.Dice,
        betSelection
      );
      eventEmitter.dispatch(Events.CREATE_GAME, game);
    } catch (error) {
      throw error;
    } finally {
      setCreating(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    create(betAmount, betSelection);
  }
  if (creating) return <div>Creating...</div>;
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6 mt-3 mb-5">
            Create a new {getGameName(GameType.Dice)} game
          </h6>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <div className="btn-group">
                {amountScales.map((amount) => (
                  <button
                    key={amount}
                    className={
                      "btn btn-outline-primary " +
                      (amount === betAmount ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={() => setBetAmount(amount)}
                  >
                    {`${amount} ${currency}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="btn-group">
                {Object.keys(Option).map((symble) => (
                  <button
                    key={Option[symble]}
                    className={
                      "btn btn-outline-primary " +
                      (Option[symble] === betSelection ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={(e) => {
                      setBetSelection(Option[symble]);
                    }}
                  >
                    {symble}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
