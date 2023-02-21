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
import Button from "../components/Button";
import Loading from "../components/Loading";
import useCreateGame from "./hooks/useCreateGame";
import useFetchGames from "./hooks/useFetchGames";
import useJoinGame from "./hooks/useJoinGame";

import "./index.css";

const DicePlayGround = React.memo((props) => {
    //      Keep Polling room status
    //      One User in the Room, Show Waiting
    //      Two User in the Room, Show Play
    
    const { gambers = [] } = props;
    const gamberLarge = gambers.find(select => select === 'big');
    const gamberSmall = gambers.find(select => select === 'small');
    const disableStart = !(gamberLarge && gamberSmall);
    
    const [diceShaking, setDiceShaking] = useState(false);

    const clickStart = useCallback(() => {
        if(disableStart) {
            window.alert("需要两位玩家同时在线才能开始")
        } else {
            setDiceShaking(shaking => !shaking);
        }
    }, [disableStart]);

    return (
        <div className="row full-height">
            <div className="col-4 center">
                <h2>大</h2>
                <div>{gamberLarge ? gamberLarge.name : '等待玩家加入'}</div>
            </div>
            <div className="col-4 center">
                <div className={`dice ${diceShaking ? 'dice-start': 'dice-end'}`}></div>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={clickStart}
                >
                    开始
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
    return (
        <div className={"full-height"}>
            {
                dice.map((die) => {
                    const { diceId, gambers } = die;
                    return (
                        <div>
                            {gambers.map((gamber) => {
                               return (
                                <div>
                                     <h4>{`Name: ${gamber.Name}`}</h4>
                                     <div>{gamber.select}</div>
                                     <Button onClick={() => join(diceId)} text={'Join Room'} />
                                </div>
                               )
  
                            })}
                        </div>
                    )
                })
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
