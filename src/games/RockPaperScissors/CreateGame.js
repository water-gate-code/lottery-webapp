import { useState, useContext } from "react";

import { connectWallet } from "../../utils";
import { createGame, ROCK_PAPER_SCISSORS_GAME_TYPE, getGameName } from "../";
import { eventEmitter, Events } from "../../event";
import { WalletContext } from "../../WalletContext";

const ALLOW_BET_AMOUNTS = ["0.01", "0.02", "0.05", "0.08", "0.1"];
const SELLECTION = ["Rock", "Paper", "Scissors"];

export function CreateGame() {
  const [betAmount, setBetAmount] = useState(ALLOW_BET_AMOUNTS[0]);
  const [betSelection, setBetSelection] = useState(1);
  const [creating, setCreating] = useState(false);
  const wallet = useContext(WalletContext);

  async function create() {
    setCreating(true);
    try {
      if (wallet.accounts.length < 1) {
        await connectWallet();
      }

      const receipt = await createGame(
        wallet.chainId,
        betAmount,
        ROCK_PAPER_SCISSORS_GAME_TYPE,
        betSelection
      );
      eventEmitter.dispatch(Events.CREATE_GAME, receipt);
    } catch (error) {
      console.error(error);
    }
    setCreating(false);
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
            Create a new {getGameName(ROCK_PAPER_SCISSORS_GAME_TYPE)} game
          </h6>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <div className="btn-group">
                {ALLOW_BET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    className={
                      "btn btn-outline-primary " +
                      (amount === betAmount ? "active" : "") +
                      " px-4"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setBetAmount(amount);
                    }}
                  >
                    {amount} ETH
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
