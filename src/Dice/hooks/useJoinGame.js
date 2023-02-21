import { useCallback, useState } from "react";
import { joinDice } from '../../service/utils';

const useJoinGame = () => {
    const [loading, setLoading] = useState(false);

    const joinGame = useCallback((diceId) => {
        setLoading(true);
        joinDice(diceId)
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            })
    })


    return {
        joinGame,
        joinLoading: loading,
    }
}

export default useJoinGame;