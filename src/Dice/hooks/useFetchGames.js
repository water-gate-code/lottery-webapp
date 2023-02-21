import { useEffect, useState } from "react";
import { getCurrentActiveDice } from '../../service/utils';

const useFetchGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchTimes, setFetchTimes] = useState(0);

    useEffect(async () => {
        let didCancel = false;
        setLoading(true);
        try {
            const res = await getCurrentActiveDice()
            setLoading(false);
            if(didCancel){
                return;
            }
            setGames(res);
        } catch(err) {
            setLoading(false);
        }

        return () => {
            didCancel = true;
        }
    }, [fetchTimes]);

    return {
        games,
        ListLoading: loading,
        refetchGames: () => setFetchTimes(times => times + 1)
    }
}

export default useFetchGames;