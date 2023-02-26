import { useEffect } from "react";
import { getDiceStatus, delay } from "../service/utils";

const useGetDiceInfoInPolling = (diceId, setCurrentDice) => {
//  Keep Polling dice status
  //  Destroy after failed 3 times
  useEffect(() => {
    let didCancel = false;
    let failedCount = 0;
    const failedThreshold = 3;
    const getStatus = async () => {
      try {
        const res = await getDiceStatus(diceId);
        if (didCancel) {
          return;
        }
        failedCount = 0;
        setCurrentDice(res);
      } catch (err) {
        if (didCancel) {
          return;
        }
        if (failedCount > failedThreshold) {
          // Toast
          setCurrentDice(undefined);
        }
        failedCount += 1;
      }

      await delay(2000);
      if (!didCancel) {
        getStatus();
      }
    }

    getStatus();

    return () => {
      didCancel = true;
    }
  }, []);
}

export default useGetDiceInfoInPolling;