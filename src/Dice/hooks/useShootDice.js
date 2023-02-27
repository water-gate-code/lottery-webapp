import { useEffect, useState } from "react";
import { payMoneyAndShoot, connectWallet } from "../service/utils";

const useShootDice = (amount, diceId) => {
  const [diceShaking, setDiceShaking] = useState(false);
  const [diceNumber, setDiceNumber] = useState(0);

  useEffect(() => {
    if (diceId) {
      setDiceNumber(0);
    }
  }, [diceId]);
  const shootDice = async (selection) => {
    setDiceShaking(true);
    try {
      const isConnect = await connectWallet();
      if (!isConnect) {
        setDiceShaking(false);
        window.alert("请连接 metaMask");
        return;
      }
    } catch (e) {
      setDiceShaking(false);
      window.alert("MetaMask 链接失败");
    }

    try {
      const res = await payMoneyAndShoot(amount, diceId, selection);
      setDiceShaking(false);
      setDiceNumber(res.result);
    } catch (err) {
      window.alert("TODO: Play失败，请重试");
      setDiceShaking(false);
    }
  };

  return {
    diceShaking,
    shootDice,
    diceNumber,
  };
};

export default useShootDice;
