import { useEffect, useState } from "react";
import { getCurrentActiveDice } from '../service/utils';

const useFetchGames = () => {
    console.log('useFetchGames');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchTimes, setFetchTimes] = useState(0);

    useEffect(() => {
        console.log('fetchTimes', fetchTimes);
        let didCancel = false;
        setLoading(true);
        getCurrentActiveDice()
            .then((res) => {
                setLoading(false);
                if (didCancel) {
                    return;
                }
                setGames(res);
            })
            .catch((err) => {
                if (didCancel) {
                    return;
                }
                setLoading(false);
            })

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