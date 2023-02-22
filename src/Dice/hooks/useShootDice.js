import { useState } from "react";
import { payMoneyAndShoot } from '../service/utils';

const useShootDice = (diceId) => {
    const [diceShaking, setDiceShaking] = useState(false);
    const [diceNumber, setDiceNumber] = useState(0);

    const shotDice = async (selection) => {
        setDiceShaking(true);
        const isConnect = await connectWallet();
        if (!isConnect) {
            setDiceShaking(false);
            window.alert('请连接 metaMask');
            return;
        }

        try {
            const res = await payMoneyAndShoot(diceId, selection);
            setDiceShaking(false);
            setDiceNumber(res.result);
        } catch (err) {
            window.alert('TODO: Play失败，请重试');
            setDiceShaking(false);
        }
    }

    return {
        diceShaking,
        shotDice,
        diceNumber,
    }
};

export default useShootDice;