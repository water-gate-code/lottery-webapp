//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done

import { useState } from "react";
import { payMoneyAndCreateGame, connectWallet } from "../service/utils";

const useCreateGame = () => {
  const [loading, setLoading] = useState(false);
  const [createdGame, setCreateGame] = useState(null);

  const creatGameAndPay = async (wagger, selection) => {
    setLoading(true);
    const isConnect = await connectWallet();
    if (!isConnect) {
      setLoading(false);
      window.alert("请连接 metaMask");
      return;
    }
    try {
      const game = await payMoneyAndCreateGame(wagger, selection);
      setLoading(false);
      setCreateGame(game);
      console.log("creatGameAndPay Succeed.");
    } catch (e) {
      setCreateGame(null);
      setLoading(false);
      window.alert("TODO: 创建游戏失败，请重试");
      console.error("creatGameAndPay Failed: ", JSON.stringify(e));
    }
  };

  return {
    creatGameAndPay,
    createLoading: loading,
    createdGame,
  };
};

export default useCreateGame;
