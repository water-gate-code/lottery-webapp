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

import React, { useCallback, useMemo, useState } from "react";
import Button from "./components/Button";
import Loading from "./components/Loading";
import useCreateGame from "./hooks/useCreateGame";
import useFetchGames from "./hooks/useFetchGames";
import useJoinGame from "./hooks/useJoinGame";
import usePlayingGame from "./hooks/usePlayingGame";
import "./index.css";

const DicePlayGround = React.memo((props) => {
    //      Keep Polling room status
    //      One User in the Room, Show Waiting
    //      Two User in the Room, Show Play

    const { dice: { gambers = [] } } = props;
    const gamberLarge = gambers.find(gamber => gamber.select === 'big');
    const gamberSmall = gambers.find(gamber => gamber.select === 'small');
    const disableStart = !(gamberLarge && gamberSmall);
    const { diceShaking, startPlaying, diceNumber } = usePlayingGame();
    const clickStart = useCallback(() => {
        if (diceShaking) {
            return;
        }
        if (disableStart) {
            window.alert("需要两位玩家同时在线才能开始");
            return;
        }
        if (diceNumber > 0) {
            window.alert("已经结束，请重开一局");
            return;
        }
        startPlaying();
    }, [disableStart, diceNumber, diceShaking]);


    return (
        <div className="row full-height">
            <div className="col-4 center">
                <h2>大</h2>
                <div>{gamberLarge ? gamberLarge.name : '等待玩家加入'}</div>
            </div>
            <div className="col-4 center">
                <div className={`dice ${diceShaking ? 'dice-start' : 'dice-end'} dice-${diceNumber}`} />
                <button
                    disable={diceShaking || diceNumber > 0}
                    type="button"
                    className="btn btn-danger"
                    onClick={clickStart}
                >
                    {diceShaking ? '正在摇骰子' : diceNumber > 0 ? '结束' : '开始'}
                </button>
            </div>
            <div className="col-4 center">
                <h2>小</h2>
                <div>{gamberSmall ? gamberSmall.name : '等待玩家加入'}</div>
            </div>
        </div>
    )
});

const DiceList = React.memo((props) => {
    const { dice = [], join } = props;
    const renderDetail = (data) => {
        const { diceId, gambers } = data;
        return (
            <div>
                {gambers.map((gamber) => (
                    <div>
                        <h4>{`Name: ${gamber.name}`}</h4>
                        <div>{gamber.select}</div>
                        <Button onClick={() => join(diceId)} text={'Join Room'} />
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div className={"full-height"}>
            {
                dice.map((die) => renderDetail(die))
            }
        </div>
    )
});


const Dice = React.memo((props) => {
    const { goBack } = props;
    const { creatGameAndPay, createLoading, createdGame } = useCreateGame();
    const { games, refetchGames, ListLoading } = useFetchGames();
    const { joinGame, joinLoading, joinedGame } = useJoinGame();
    const showLoading = useMemo(() => createLoading || ListLoading || joinLoading, [createLoading, ListLoading, joinLoading]);
    const showDicePlayground = createdGame || joinedGame;
    const showList = !showDicePlayground;

    return (
        <div className="dice-container container">
            {showLoading && (<Loading />)}
            <h1 className="title">掷骰子</h1>
            <div className='row dice-content'>
                <div className='col-3 navigation'>
                    <Button onClick={goBack} text={'返回'} />
                    <Button onClick={creatGameAndPay} text={'创建游戏'} />
                    <Button onClick={refetchGames} text={'刷新游戏列表'} />
                </div>
                <div className='col-9 playground full-height'>
                    {showDicePlayground && <DicePlayGround dice={createdGame || joinedGame} />}
                    {showList && <DiceList dice={games} join={joinGame} />}
                </div>
            </div>
        </div>
    );
});

export default Dice;
