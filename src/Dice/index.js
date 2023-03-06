// User join:
//      Game [Create Button]
//      View all Dice status, with [Join Button][Refresh Button]
// User Click [Create Button]:
//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done
// User Click [Join Button]:
//      Connect Wallet / Loading
//      Join Game / Loaing
//        - Failed by room fulfilled
//      Into Game Room / Done
//
//
// User In Game Room:
//      Keep Polling room status
//      One User in the Room, Show Waiting
//      Two User in the Room, Show Play
// One of the User Click Play:
//      Call play / Shaking Dice
//      Get Result / Stop Dice and show Result
//

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import Button from "./components/Button";
import Loading from "./components/Loading";
import useCreateGame from "./hooks/useCreateGame";
import useFetchGames from "./hooks/useFetchGames";
import useShootDice from "./hooks/useShootDice";

import "./index.css";
import Version from "./components/Version";

const DICE_WAGER = "0.1";

export const DicePlayGround = React.memo((props) => {
  const {
    dice: { diceId },
    selection,
  } = props;

  const [currentDice, setCurrentDice] = useState(undefined);
  const { gambers = [] } = currentDice || {};
  const gamberLarge = gambers.find((gamber) => gamber.select === "big");
  const gamberSmall = gambers.find((gamber) => gamber.select === "small");

  const largeDisplayName = gamberLarge?.address
    ? gamberLarge.name
    : selection === "big"
    ? "Me"
    : "等待玩家加入";

  const smallDisplayName = gamberSmall?.address
    ? gamberSmall.name
    : selection === "small"
    ? "Me"
    : "等待玩家加入";

  const { diceShaking, shootDice, diceNumber } = useShootDice(
    DICE_WAGER,
    diceId
  );

  useLayoutEffect(() => {
    setCurrentDice(props.dice);
  }, [props.dice]);

  const oShootDice = useCallback(() => {
    const twoPlayerInTheGame = gamberLarge.address && gamberSmall.address;
    const justJoinedAPlayer =
      (gamberLarge.address || gamberSmall.address) && selection;
    if (twoPlayerInTheGame || justJoinedAPlayer) {
      shootDice(selection);
    } else {
      window.alert("Waiting for another player");
    }
  }, [shootDice, selection]);

  const isEnd = !diceShaking && diceNumber > 0;
  const isStart = !diceShaking && diceNumber === 0;

  return (
    <div className="row full-height">
      <div className="col-4 center">
        {isEnd && (diceNumber > 3 ? <h4>Winnder</h4> : <h4>Loser</h4>)}
        <h2>大</h2>
        <div>{largeDisplayName}</div>
      </div>
      <div className="col-4 center">
        <div
          className={`dice ${
            diceShaking ? "dice-start" : "dice-end"
          } dice-${diceNumber}`}
        />
        {diceShaking && (
          <button disabled type="button" className="btn btn-danger">
            正在摇骰子
          </button>
        )}
        {isStart && (
          <button type="button" className="btn btn-danger" onClick={oShootDice}>
            掷骰子
          </button>
        )}
        {isEnd && (
          <button disabled type="button" className="btn btn-danger">
            结束
          </button>
        )}
      </div>
      <div className="col-4 center">
        {isEnd && (diceNumber < 4 ? <h4>Winnder</h4> : <h4>Loser</h4>)}
        <h2>小</h2>
        <div>{smallDisplayName}</div>
      </div>
    </div>
  );
});

const DiceCreate = React.memo((props) => {
  const { creatGameAndPay, refetchGames } = props;
  const createGame = useCallback(
    async (selection) => {
      try {
        await creatGameAndPay(DICE_WAGER, selection);
        refetchGames();
      } catch (err) {
        refetchGames();
        // TODO
      }
    },
    [creatGameAndPay, refetchGames]
  );

  return (
    <div className="row full-height">
      <div className="col-4 center">
        <h2>大</h2>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => createGame("big")}
        >
          选择
        </button>
      </div>
      <div className="col-4 center">
        <div className={"dice"} />
      </div>
      <div className="col-4 center">
        <h2>小</h2>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => createGame("small")}
        >
          选择
        </button>
      </div>
    </div>
  );
});
