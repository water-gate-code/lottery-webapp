//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import { useState, useCallback } from "react";
import {connectWallet, payMoney} from "../../service/utils";

const delay = (number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, number)
    })
}
const useCreateGame = () => {
    const [loading, setLoading] = useState(false);

    const creatGameAndPay = useCallback(async () => {
        setLoading(true);
        window.alert('creatGameAndPay Loading')
        try {
            delay(1000)
            // await connectWallet();
            // // TODO: create ABI
            // await payMoney();
            setLoading(false);
            window.alert('creatGameAndPay Succeed')
            console.error('creatGameAndPay Succeed: ');
        } catch (e) {
            setLoading(false);
            window.alert('creatGameAndPay Failed')
            console.error('creatGameAndPay Failed: ', JSON.stringify(e));
        }
    }, [])

    return {
        creatGameAndPay,
        createLoading: loading,
    }
}

export default useCreateGame;