import { useState, FormEvent } from "react";

import { connectWallet } from "../../utils/wallet";

import { eventEmitter, Events } from "../../event";
import { useAppSelector } from "../../hooks";
import { selectCasino, selectChain } from "../../store/slices/chain";
import { selectUser } from "../../store/slices/user";
import { GameType, getGameName } from "../../utils/casino";

const SELLECTION = ["Rock", "Paper", "Scissors"];

export function CreateGame() {
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;
  if (!supportChain) {
    throw new Error("Invalid chain");
  }
  const currency = chain.info.nativeCurrency.symbol;
  const amountScales =
    chain === null
      ? []
      : [1, 2, 5, 8, 10].map((n) => n * chain.config.nativeMinScale);
  const [betAmount, setBetAmount] = useState(amountScales[0]);
  const [betSelection, setBetSelection] = useState(1);
  const [creating, setCreating] = useState(false);

  async function create() {
    setCreating(true);
    try {
      if (!user.authed) {
        await connectWallet();
      }
      if (casino === null) {
        throw new Error("Contract not exist");
      }
      const receipt = await casino.createGame(
        betAmount,
        GameType.rps,
        betSelection
      );
      eventEmitter.dispatch(Events.CREATE_GAME, receipt);
    } catch (error) {
      throw error;
    } finally {
      setCreating(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create();
  }
  if (creating)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6 mt-3 mb-5">
            Create a new {getGameName(GameType.rps)} game
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
