import { payMoneyAndCreateGame } from "../utils";

import { eventEmitter, Events } from "../event";
import { useState } from "react";

async function create(amount, selection) {
  const response = await payMoneyAndCreateGame(amount, selection);
  eventEmitter.dispatch(Events.CREATE_GAME, response);
}

const ALLOW_BET_AMOUNTS = ["0.1", "0.2", "0.5", "0.8", "1"];
const SELLECTION = ["big", "small"];

export function NewGame() {
  const [betAmount, setBetAmount] = useState(ALLOW_BET_AMOUNTS[0]);
  const [betSelection, setBetSelection] = useState(SELLECTION[0]);

  function onSubmit(e) {
    e.preventDefault();
    create(betAmount, betSelection);
  }
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
