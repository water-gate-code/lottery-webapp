//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import { useState, useCallback } from "react";
import { payMoneyAndCreateGame } from "../service/utils";

const useCreateGame = () => {
    const [loading, setLoading] = useState(false);
    const [createdGame, setCreateGame] = useState(null);

    const creatGameAndPay = async (wagger, selection) => {
        setLoading(true);
        const isConnect = await connectWallet();
        if (!isConnect) {
            setDiceShaking(false);
            window.alert('请连接 metaMask');
            return;
        }
        try {
            const res = await payMoneyAndCreateGame(wagger, selection);
            setLoading(false);
            setCreateGame(res);
            console.error('creatGameAndPay Succeed: ');
        } catch (e) {
            setCreateGame(null);
            setLoading(false);
            window.alert('TODO: 创建游戏失败，请重试');
            console.error('creatGameAndPay Failed: ', JSON.stringify(e));
        }
    };

    return {
        creatGameAndPay,
        createLoading: loading,
        createdGame,
    }
}

export default useCreateGame;