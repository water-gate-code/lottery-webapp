import { useEffect, useState } from "react";
import { payMoneyAndShoot } from "../service/utils";
import { useAccountContext } from "../context/Account";

const useShootDice = (amount, diceId) => {
  const [diceShaking, setDiceShaking] = useState(false);
  const [diceNumber, setDiceNumber] = useState(0);
  const { connectWallet, isConnected } = useAccountContext()

  useEffect(() => {
    if (diceId) {
      setDiceNumber(0);
    }
  }, [diceId]);
  const shootDice = async (selection) => {
    if (!isConnected) {
      await connectWallet();
    }

    setDiceShaking(true);

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
