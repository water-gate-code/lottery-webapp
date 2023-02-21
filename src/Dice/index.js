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

import React, { useMemo } from "react";
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

    return (
        <div className="row">
            <div className="col-3">
                <h2>大</h2>
                <div>{gamberLarge ? gamberLarge.name : '等待玩家加入'}</div>
            </div>
            <div className="col-3">
                <div>dice</div>
                <button
                    disabled = {!(gamberLarge && gamberSmall)}
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {window.alert('TODO')}}
                >
                    开始
                </button>
            </div>
            <div className="col-3">
                <h2>小</h2>
                <div>{gamberSmall ? gamberSmall.name : '等待玩家加入'}</div>
            </div>
        </div>
    )
});

const Dice = React.memo((props) => {
    const { goBack } = props;
    const { creatGameAndPay, createLoading } = useCreateGame();
    const { games, refetchGames, ListLoading } = useFetchGames();
    const { joinGame, joinLoading } = useJoinGame();

    const showLoading = useMemo(() => createLoading || ListLoading || joinLoading, [createLoading, ListLoading, joinLoading]);
    const showList = false;
    const showDicePlayground = true;

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
                <div className='col-9 playground'>
                    {showDicePlayground && <DicePlayGround />}
                    {
                        showList && games.map((data) => {
                            const { diceId, gamblerName } = data;
                            return (
                                <div>
                                    <h4>{`Name: ${gamblerName}`}</h4>
                                    <Button onClick={() => joinGame(diceId)} text={'Join Room'} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
});

export default Dice;
