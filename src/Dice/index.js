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

import React, { useMemo, useCallback, useState } from "react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import useCreateGame from "./hooks/useCreateGame";
import "./index.css";

const Dice = React.memo((props) => {
    const { goBack } = props;
    const [loading, setLoading] = useState(false);
    const { creatGameAndPay, createLoading } = useCreateGame();
    const { games, refetchGames, ListLoading } = useFetchGames();

    const refreshRoom = useCallback(() => {
        console.log("refreshRoom");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const joinRoom = useCallback((roomId) => {
        console.log("joinRoom");
    }, []);

    const showLoading = useMemo(() => createLoading || ListLoading, [createLoading, ListLoading]);
    return (
        <div className="dice-container">
            {showLoading && (<Loading />)}
            <Button onClick={creatGameAndPay} text={'Create Room'} />
            <Button onClick={refetchGames} text={'Refresh Room'} />
            {
                games.map((data) => {
                    const { diceId, gamblerAdress, gamblerName, select } = data;
                    return (
                        <div>
                            <h4>Name: ${gamblerName}</h4>
                            <Button onClick={() => joinRoom(id)} text={'Join Room'} />
                        </div>
                    )
                })
            }
        </div>
    );
});

export default Dice;
