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

const DICE_WAGER = "1";

const DicePlayGround = React.memo((props) => {
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

const DiceList = React.memo((props) => {
  const { dice = [], join } = props;
  const renderDetail = (data) => {
    const { diceId, gambers } = data;
    const onSelectGame = (selection) => {
      //   setSelection(selection);
      join(diceId, selection);
    };

    return (
      <div className="dice-item" key={diceId}>
        {gambers.map((gamber) => (
          <div className="dice-gamber" key={gamber.address}>
            <h4>{gamber.select === "big" ? "大" : "小"}</h4>
            {gamber.address ? (
              <div className="dice-gamber-name">{gamber.name}</div>
            ) : (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => onSelectGame(gamber.select)}
              >
                选择
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={"full-height"}>{dice.map((die) => renderDetail(die))}</div>
  );
});

const GameList = React.memo((props) => {
  const { joinGame, games } = props;
  return (
    <div className="game-list-container">
      <DiceList dice={games} join={joinGame} />
    </div>
  );
});

const Dice = React.memo((props) => {
  document.title = "Dice";
  const [showNewGame, setShowNewGame] = useState(true);
  const [joinedGame, setJoinedGame] = useState(null);
  // 避免多次调用合约，selection 需要先存储下来，后续在开始掷骰子的时候一并调用合约的 play 方法
  const [selection, setSelection] = useState(undefined);
  const { creatGameAndPay, createLoading, createdGame } = useCreateGame();
  const { games, refetchGames, listLoading } = useFetchGames();

  const onJoinedGame = (diceId, selection) => {
    games.forEach((game) => {
      if (game.diceId === diceId) {
        setJoinedGame(game);
      }
    });
    setSelection(selection);
  };

  const showLoading = useMemo(
    () => createLoading || listLoading,
    [createLoading, listLoading]
  );

  useEffect(() => {
    const selectedGame = createdGame || joinedGame;
    if (selectedGame) {
      setShowNewGame(false);
    }
  }, [createdGame, joinedGame]);

  const clickNewGame = () => {
    setShowNewGame(true);
    setSelection(undefined);
  };

  return (
    <div className="dice-container container">
      {showLoading && <Loading />}
      <h1 className="title">掷骰子</h1>
      {/* <Button onClick={goBack} text={'返回'} /> */}
      <div className="row dice-content">
        <div className="col-3 navigation">
          <Button onClick={clickNewGame} text={"新游戏"} />
          <Button onClick={refetchGames} text={"刷新游戏列表"} />
          <GameList joinGame={onJoinedGame} games={games} />
        </div>
        <div className="col-9 playground full-height">
          {showNewGame ? (
            <DiceCreate
              creatGameAndPay={creatGameAndPay}
              setSelection={setSelection}
              refetchGames={refetchGames}
            />
          ) : (
            <DicePlayGround
              dice={createdGame || joinedGame}
              selection={selection}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default Dice;
