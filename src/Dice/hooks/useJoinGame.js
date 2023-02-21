import { useCallback, useState } from "react";
import { joinDice } from '../../service/utils';

const useJoinGame = () => {
    const [loading, setLoading] = useState(false);
    const [joinedGame, setJoinedGame] = useState(null);

    const joinGame = useCallback((diceId) => {
        setLoading(true);
        joinDice(diceId)
            .then((res) => {
                setJoinedGame(res);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            })
    }, [])


    return {
        joinGame,
        joinLoading: loading,
        joinedGame,
    }
}

export default useJoinGame;