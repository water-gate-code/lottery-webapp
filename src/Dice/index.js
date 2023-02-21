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


const Dice = React.memo((props) => {
    const { goBack } = props;
    const { creatGameAndPay, createLoading } = useCreateGame();
    const { games, refetchGames, ListLoading } = useFetchGames();
    const { joinGame, joinLoading } = useJoinGame();

    const showLoading = useMemo(() => createLoading || ListLoading || joinLoading, [createLoading, ListLoading, joinLoading]);

    return (
        <div className="dice-container">
            {showLoading && (<Loading />)}
            <Button onClick={goBack} text={'Go Back'} />
            <Button onClick={creatGameAndPay} text={'Create Room'} />
            <Button onClick={refetchGames} text={'Refresh Room'} />
            {
                games.map((data) => {
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
    );
});

export default Dice;
