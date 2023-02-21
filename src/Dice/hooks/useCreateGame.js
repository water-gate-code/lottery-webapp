//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import { useState, useCallback } from "react";
import {connectWallet, payMoneyAndCreateGame} from "../service/utils";

const useCreateGame = () => {
    const [loading, setLoading] = useState(false);
    const [createdGame, setCreateGame] = useState(null);

    const creatGameAndPay = useCallback(async () => {
        setLoading(true);
        try {
            // delay(1000)
            await connectWallet();
            // // TODO: create ABI
            const res = await payMoneyAndCreateGame(5);
            setLoading(false);
            setCreateGame(res);
            console.error('creatGameAndPay Succeed: ');
        } catch (e) {
            setCreateGame(null);
            setLoading(false);
            console.error('creatGameAndPay Failed: ', JSON.stringify(e));
        }
    }, []);

    return {
        creatGameAndPay,
        createLoading: loading,
        createdGame,
    }
}

export default useCreateGame;