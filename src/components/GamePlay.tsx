import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { connectWallet } from "../utils/wallet";

import { selectCasino, selectChain } from "../store/slices/chain";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import {
  GameType,
  getGameChioce,
  getGameNameKey,
  parseGameType,
} from "../utils/casino";
import { createGame, selectGame } from "../store/slices/game";
import { nanoid } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";

// const Choice: { [choice: string]: number } = {
//   small: 1,
//   big: 6,
// };

export function GamePlay() {
  const { t } = useTranslation();
  const { gameType: gameTypeKey } = useParams();
  if (gameTypeKey === undefined) throw new Error("Invalid game type");
  const gameType = parseGameType(gameTypeKey);
  const dispacth = useAppDispatch();
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  // const { createGames } = useAppSelector(selectGame);
  const chain = useAppSelector(selectChain);
  if (chain.id === null || !chain.support) {
    throw new Error("Invalid chain");
  }

  const currency = chain.info.nativeCurrency.symbol;
  const amountScales = [1, 2, 5, 8, 10].map((n) =>
    (n * chain.config.nativeMinScale).toString()
  );
  const [wager, setWager] = useState(amountScales[0]);

  const choices = getGameChioce(gameType);
  const [choice, setChoice] = useState(choices[Object.keys(choices)[0]]);
  //   const [creating, setCreating] = useState(false);
  const [creationId, setCreationId] = useState(nanoid());

  //   useEffect(() => {
  //     const request = createGames[creationId];

  //     if (request && request.game.status === "loading") {
  //       !creating && setCreating(true);
  //     } else {
  //       creating && setCreating(false);
  //     }

  //     if (request && request.game.status === "succeeded") {
  //       setCreationId(nanoid());
  //       if (request.game.value === null)
  //         throw new Error("Empty data after creation");
  //       //   onCreateGameSuccess && onCreateGameSuccess(request.game.value);
  //     } else if (request && request.game.status === "failed") {
  //       setCreationId(nanoid());
  //     }
  //   }, [creating, setCreating, createGames, creationId]);

  async function create() {
    if (!user.authed) {
      await connectWallet();
    }
    if (casino === null) {
      throw new Error("Contract not exist");
    }
    const type = GameType.dice;
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
    create();
  }
  //   if (creating)
  //     return (
  //       <div className="d-flex justify-content-center">
  //         <div className="spinner-border text-primary m-5" role="status"></div>
  //       </div>
  //     );

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="display-6 mt-3 mb-5">
            {t("game.createTitle", {
              gameName: t(gameTypeKey),
            })}
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
                      (amount === wager ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={() => setWager(amount)}
                  >
                    {`${amount} ${currency}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="btn-group">
                {Object.keys(choices).map((c) => (
                  <button
                    key={c}
                    className={
                      "btn btn-outline-primary " +
                      (choice === choices[c] ? "active" : "") +
                      " px-4"
                    }
                    type="button"
                    onClick={(e) => {
                      setChoice(choices[c]);
                    }}
                  >
                    {t(`game.${gameTypeKey}.choice.${c}`)}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {t("game.create")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
