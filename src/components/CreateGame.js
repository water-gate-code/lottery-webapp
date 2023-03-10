import { useState, useContext } from "react";

import { payMoneyAndCreateGame, connectWallet } from "../utils";
import { eventEmitter, Events } from "../event";
import { WalletContext } from "../WalletContext";

const ALLOW_BET_AMOUNTS = ["0.1", "0.2", "0.5", "0.8", "1"];
const SELLECTION = ["big", "small"];

export function CreateGame() {
  const [betAmount, setBetAmount] = useState(ALLOW_BET_AMOUNTS[0]);
  const [betSelection, setBetSelection] = useState(SELLECTION[0]);
  const [creating, setCreating] = useState(false);
  const wallet = useContext(WalletContext);

  async function create() {
    setCreating(true);
    try {
      if (wallet.accounts.length < 1) {
        await connectWallet();
      }
      const response = await payMoneyAndCreateGame(betAmount, betSelection);
      eventEmitter.dispatch(Events.CREATE_GAME, response);
    } catch (error) {
      console.error(error);
    }
    setCreating(false);
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
          <h1 className="display-1">Create Game</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <div className="btn-group">
                {ALLOW_BET_AMOUNTS.map((amount) => (
                  <a
                    key={amount}
                    className={
                      "btn btn-outline-primary " +
                      (amount == betAmount ? "active" : "") +
                      " px-4"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setBetAmount(amount);
                    }}
                  >
                    {amount} ETH
                  </a>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="btn-group">
                {SELLECTION.map((sellection) => (
                  <a
                    key={sellection}
                    className={
                      "btn btn-outline-primary " +
                      (sellection == betSelection ? "active" : "") +
                      " px-4"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setBetSelection(sellection);
                    }}
                  >
                    {sellection}
                  </a>
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
