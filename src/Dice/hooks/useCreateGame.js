//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import { useState, useCallback } from "react";
import {connectWallet, payMoney} from "../../service/utils";

const useCreateGame = () => {
    const [loading, setLoading] = useState(false);

    const creatGameAndPay = useCallback(async () => {
        setLoading(true);
        try {
            await connectWallet();
            // TODO: create ABI
            await payMoney();
            setLoading(false);
            console.error('creatGameAndPay Succeed: ');
        } catch (e) {
            setLoading(false);
            console.error('creatGameAndPay Failed: ', JSON.stringify(e));
        }
    }, [])

    return {
        creatGameAndPay,
        createLoading: loading,
    }
}

export default useCreateGame;