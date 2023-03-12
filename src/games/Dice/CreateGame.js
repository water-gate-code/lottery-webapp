import { useState, useContext } from "react";

import { connectWallet } from "../../utils";
import { payMoneyAndCreateGame, DICE_GAME_TYPE, getGameName } from "../";
import { eventEmitter, Events } from "../../event";
import { WalletContext } from "../../WalletContext";

const ALLOW_BET_AMOUNTS = ["0.01", "0.02", "0.05", "0.08", "0.1"];
const SELLECTION = ["Small", "Big"];

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
      const response = await payMoneyAndCreateGame(
        wallet.chainId,
        betAmount,
        betSelection
      );
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
          <h6 className="display-6 mt-3 mb-5">
            Create a new {getGameName(DICE_GAME_TYPE)} game
          </h6>
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
