import { useCallback, useState } from "react";
import { joinDice } from '../service/utils';

const useJoinGame = () => {
    const [loading, setLoading] = useState(false);
    const [joinedGame, setJoinedGame] = useState(null);

    const joinGame = useCallback(async (diceId) => {
        setLoading(true);
        try{
            const res = await joinDice(diceId);
            setJoinedGame(res);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setJoinedGame(null);
        }
    }, [])


    return {
        joinGame,
        joinLoading: loading,
        joinedGame,
    }
}

export default useJoinGame;