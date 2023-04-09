import { useState, FormEvent, useEffect } from "react";

import { connectWallet } from "../../utils/wallet";

import { selectCasino, selectChain } from "../../store/slices/chain";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser } from "../../store/slices/user";
import { Game, GameType, getGameName } from "../../utils/casino";
import { createGame, selectGame } from "../../store/slices/game";
import { nanoid } from "@reduxjs/toolkit";

const Option: { [option: string]: number } = {
  Small: 1,
  Big: 6,
};

export function CreateGame({
  onCreateGameSuccess,
}: {
  onCreateGameSuccess: (game: Game) => void;
}) {
  const dispacth = useAppDispatch();
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const { createGames } = useAppSelector(selectGame);
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
  const [betSelection, setBetSelection] = useState(Option.Small);
  const [creating, setCreating] = useState(false);
  const [creationId, setCreationId] = useState(nanoid());

  useEffect(() => {
    const request = createGames[creationId];

    if (request && request.game.status === "loading") {
      !creating && setCreating(true);
    } else {
      creating && setCreating(false);
    }

    if (request && request.game.status === "succeeded") {
      setCreationId(nanoid());
      if (request.game.value === null)
        throw new Error("Empty data after creation");
      onCreateGameSuccess && onCreateGameSuccess(request.game.value);
    } else if (request && request.game.status === "failed") {
      setCreationId(nanoid());
    }
  }, [creating, setCreating, createGames, creationId, onCreateGameSuccess]);

  async function create(betAmount: number, betSelection: number) {
    if (!user.authed) {
      await connectWallet();
    }
    if (casino === null) {
      throw new Error("Contract not exist");
    }
    const type = GameType.dice;
    const wager = betAmount;
    const choice = betSelection;
    dispacth(
      createGame({
        casino,
        creationId,
        type,
        wager,
        choice,
      })
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create(betAmount, betSelection);
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
            Create a new {getGameName(GameType.dice)} game
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
