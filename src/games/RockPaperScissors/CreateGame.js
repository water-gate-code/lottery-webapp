import { useState, useContext } from "react";

import { connectWallet } from "../../utils";
import { GameType, getGameName } from "../";
import { eventEmitter, Events } from "../../event";
import { WalletContext } from "../../contexts/WalletContext";

const SELLECTION = ["Rock", "Paper", "Scissors"];

export function CreateGame() {
  const { accounts, casino, chain } = useContext(WalletContext);
  const currency = chain.info.nativeCurrency.symbol;
  const amountScales = [1, 2, 5, 8, 10].map((n) => n * chain.nativeMinScale);
  const [betAmount, setBetAmount] = useState(amountScales[0]);
  const [betSelection, setBetSelection] = useState(1);
  const [creating, setCreating] = useState(false);

  async function create() {
    setCreating(true);
    try {
      if (accounts.length < 1) {
        await connectWallet();
      }

      const receipt = await casino.createGame(
        betAmount,
        GameType.Rps,
        betSelection
      );
      eventEmitter.dispatch(Events.CREATE_GAME, receipt);
    } catch (error) {
      throw error;
    } finally {
      setCreating(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    create();
  }
  if (creating) return <div>Creating...</div>;
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6 mt-3 mb-5">
            Create a new {getGameName(GameType.Rps)} game
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
                {SELLECTION.map((sellection, index) => (
                  <button
                    key={sellection}
                    className={
                      "btn btn-outline-primary " +
                      (index + 1 === betSelection ? "active" : "") +
                      " px-4"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setBetSelection(index + 1);
                    }}
                  >
                    {sellection}
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
