//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import {connectWallet, payMoney} from "../../serivce/utils";

const useCreateGame = () => {
    const [loading, setLoading] = useState(false);

    const creatGameAndPay = useCallback(async () => {
        setLoading(true);
        try {
            await connectWallet();
            // TODO: create ABI
            await payMoney();
            setLoading(false);
            console.error('creatGameAndPay Succeed: ', JSON.stringify(e));
        } catch (e) {
            setLoading(false);
            console.error('creatGameAndPay Failed: ', JSON.stringify(e));
        }
    }, [])

    return {
        creatGameAndPay,
        createLoading,
    }
}

export default useCreateGame;